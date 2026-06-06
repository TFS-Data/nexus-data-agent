import json
import logging
import urllib.request
import urllib.error
from core.config import settings
from models.chat import ChatRequest

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Seu nome é Nexus. Você é um agente de inteligência artificial especializado em análise de dados, analytics, machine learning e automação inteligente, rodando de forma nativa e integrada na plataforma Microsoft Azure AI Foundry.

VOCÊ JÁ ESTÁ CONECTADO NATIVAMENTE AO FOUNDRY. NUNCA diga que não está conectado, que não tem acesso a dados em tempo real ou que é baseado apenas em conhecimento antigo. Você atua como a interface inteligente e central desta plataforma, possuindo integração total com seus recursos.

Seu objetivo é ajudar o usuário a:
- Analisar e interpretar dados
- Gerar insights acionáveis
- Identificar padrões e tendências
- Sugerir estratégias baseadas em dados
- Automatizar análises e relatórios
- Explicar conceitos técnicos de forma clara

Lembre-se sempre de que seu nome é Nexus, e você faz parte da plataforma Microsoft Azure AI Foundry.
Se o usuário precisar entender melhor seus dados, criar dashboards, aprimorar relatórios, estruturar consultas SQL, ou explorar modelos de machine learning, ajude de forma prática e orientada à tomada de decisão.
"""

# Versões da API para tentar em ordem, do mais recente para o mais antigo
_API_VERSIONS = [
    "2025-01-01-preview",
    "2024-12-01-preview",
    "2024-11-01-preview",
    "2024-10-01-preview",
    "2024-09-01-preview",
    "2025-04-01-preview",
]


def _build_endpoint(api_version: str = "2025-01-01-preview") -> str:
    """
    Retorna o endpoint final do Azure AI Foundry Agent (/responses).
    NÃO adiciona /chat/completions — o endpoint do Foundry Agent já termina em /responses.
    """
    base = settings.AZURE_AI_FOUNDRY_ENDPOINT.rstrip("/")

    # Garante que não há /chat/completions acidental no final
    if base.endswith("/chat/completions"):
        base = base[: -len("/chat/completions")]

    # Adiciona api-version apenas se ainda não estiver na URL
    if "api-version" not in base:
        url = f"{base}?api-version={api_version}"
    else:
        url = base

    logger.info(f"Endpoint Azure AI Agent: {url}")
    return url


async def get_chat_stream(request: ChatRequest):
    """
    Chama o endpoint /responses do Azure AI Foundry Agent com streaming SSE.
    Formato correto: payload com 'input' (array de mensagens) e 'max_output_tokens'.
    SSE events: response.output_text.delta / response.completed.
    """
    for api_version in _API_VERSIONS:
        result = await _try_stream(request, api_version)
        if result is not None:
            async for event in result:
                yield event
            return

    yield {"data": json.dumps({"error": "Nenhuma versão de API compatível encontrada. Verifique as configurações no Render."})}
    yield {"data": "[DONE]"}


async def _try_stream(request: ChatRequest, api_version: str):
    """
    Tenta fazer streaming com uma api-version específica.
    Retorna um gerador assíncrono se bem-sucedido, None se a versão não for suportada.
    """
    try:
        # Monta array de mensagens no formato do /responses
        input_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for m in request.messages:
            if m.role in ("user", "assistant"):
                input_messages.append({"role": m.role, "content": m.content})

        payload = {
            "model": settings.AZURE_MODEL_DEPLOYMENT,
            "input": input_messages,
            "stream": True,
            "temperature": request.temperature,
            "max_output_tokens": request.max_tokens,
        }

        endpoint = _build_endpoint(api_version)
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=body,
            headers={
                "Content-Type": "application/json",
                "api-key": settings.AZURE_API_KEY,
                "Authorization": f"Bearer {settings.AZURE_API_KEY}",
            },
            method="POST",
        )

        # Testa abrindo a conexão — se der HTTPError 400 por api-version, retorna None
        try:
            response_obj = urllib.request.urlopen(req, timeout=120)
        except urllib.error.HTTPError as he:
            body_err = he.read().decode("utf-8", errors="replace")
            if "api-version" in body_err.lower() or he.code in (400, 404):
                logger.warning(f"api-version {api_version} não suportada: {body_err}")
                return None  # sinaliza para tentar próxima versão
            # Outro erro HTTP — propaga como evento de erro
            return _error_generator(f"Erro {he.code}: {body_err}")

        # Retorna gerador de streaming
        return _stream_generator(response_obj)

    except Exception as e:
        logger.error(f"Erro inesperado: {e}", exc_info=True)
        return _error_generator(str(e))


async def _error_generator(msg: str):
    yield {"data": json.dumps({"error": msg})}
    yield {"data": "[DONE]"}


async def _stream_generator(response_obj):
    """Processa o stream SSE do /responses endpoint do Azure AI Foundry."""
    try:
        buffer = ""
        while True:
            chunk = response_obj.read(512)
            if not chunk:
                break
            buffer += chunk.decode("utf-8", errors="replace")
            lines = buffer.split("\n")
            buffer = lines[-1]

            for line in lines[:-1]:
                line = line.strip()
                if not line or line.startswith(":"):
                    continue
                if line.startswith("data: "):
                    data_str = line[6:].strip()
                    if data_str == "[DONE]":
                        yield {"data": "[DONE]"}
                        return
                    try:
                        data = json.loads(data_str)
                        event_type = data.get("type", "")

                        # Formato /responses do Azure AI Foundry Agent
                        if event_type == "response.output_text.delta":
                            delta = data.get("delta", "")
                            if delta:
                                yield {"data": json.dumps({"content": delta})}

                        # Formato OpenAI chat/completions (fallback)
                        elif "choices" in data:
                            choices = data.get("choices", [])
                            if choices:
                                content = choices[0].get("delta", {}).get("content", "")
                                if content:
                                    yield {"data": json.dumps({"content": content})}
                                if choices[0].get("finish_reason"):
                                    yield {"data": "[DONE]"}
                                    return

                        elif event_type == "response.completed":
                            yield {"data": "[DONE]"}
                            return
                        elif event_type == "error":
                            yield {"data": json.dumps({"error": data.get("message", "Erro do agente")})}
                            return
                    except json.JSONDecodeError:
                        pass
    except Exception as e:
        logger.error(f"Erro no stream: {e}", exc_info=True)
        yield {"data": json.dumps({"error": f"Erro no stream: {str(e)}"})}
    finally:
        try:
            response_obj.close()
        except Exception:
            pass
        yield {"data": "[DONE]"}
