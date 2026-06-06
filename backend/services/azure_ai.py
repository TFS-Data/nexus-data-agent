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


def _build_endpoint() -> str:
    """
    Monta a URL final do endpoint /chat/completions.
    - Se o endpoint base já tiver /vN/ no path (ex: /openai/v1), NÃO adiciona api-version.
    - Para endpoints clássicos Azure OpenAI (.openai.azure.com), adiciona api-version.
    """
    base = settings.AZURE_AI_FOUNDRY_ENDPOINT.rstrip("/")

    # Remove /chat/completions no final se já existir para evitar duplicação
    if base.endswith("/chat/completions"):
        base = base[: -len("/chat/completions")]

    url = f"{base}/chat/completions"

    # Só adiciona api-version se ainda não estiver na URL
    # E apenas para endpoints clássicos (.openai.azure.com) —
    # o endpoint do AI Foundry Projects (/openai/v1) não usa api-version como query param
    has_version_in_path = "/openai/v" in url or "/v1/" in url or url.endswith("/v1")
    if "api-version" not in url and not has_version_in_path:
        url = f"{url}?api-version=2024-10-21"

    logger.info(f"Endpoint final: {url}")
    return url



async def get_chat_stream(request: ChatRequest):
    """
    Chama o endpoint /chat/completions do Azure AI Foundry com streaming SSE.
    Usa o formato padrão da API OpenAI (messages + max_tokens).
    """
    try:
        # Monta lista de mensagens no formato OpenAI
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for m in request.messages:
            if m.role in ("user", "assistant"):
                messages.append({"role": m.role, "content": m.content})

        payload = {
            "model": settings.AZURE_MODEL_DEPLOYMENT,
            "messages": messages,
            "stream": True,
            "temperature": request.temperature,
            "max_tokens": request.max_tokens,
        }

        endpoint = _build_endpoint()
        logger.info(f"Chamando endpoint: {endpoint}")

        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=body,
            headers={
                "Content-Type": "application/json",
                "api-key": settings.AZURE_API_KEY,
            },
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=120) as response:
            buffer = ""
            while True:
                chunk = response.read(512)
                if not chunk:
                    break
                buffer += chunk.decode("utf-8", errors="replace")
                lines = buffer.split("\n")
                buffer = lines[-1]  # guarda linha incompleta

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
                            # Formato OpenAI chat/completions stream
                            choices = data.get("choices", [])
                            if choices:
                                delta = choices[0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    yield {"data": json.dumps({"content": content})}
                                finish_reason = choices[0].get("finish_reason")
                                if finish_reason:
                                    yield {"data": "[DONE]"}
                                    return
                        except json.JSONDecodeError:
                            pass

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        logger.error(f"HTTPError {e.code}: {error_body}")
        try:
            err_json = json.loads(error_body)
            msg = err_json.get("error", {}).get("message", error_body)
        except Exception:
            msg = error_body
        yield {"data": json.dumps({"error": f"Erro {e.code}: {msg}"})}
    except Exception as e:
        logger.error(f"Erro ao comunicar com Azure AI Foundry: {str(e)}", exc_info=True)
        yield {"data": json.dumps({"error": f"Erro interno: {str(e)}"})}
    finally:
        yield {"data": "[DONE]"}
