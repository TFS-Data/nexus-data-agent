import json
import logging
import urllib.request
import urllib.error
from core.config import settings
from models.chat import ChatRequest

logger = logging.getLogger(__name__)

def _build_system_prompt():
    return """Seu nome é Nexus. Você é um agente de inteligência artificial especializado em análise de dados, analytics, machine learning e automação inteligente, rodando de forma nativa e integrada na plataforma Microsoft Azure AI Foundry.

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

async def get_chat_stream(request: ChatRequest):
    """
    Chama o endpoint de Agente do Azure AI Foundry (/responses).
    Suporta streaming via SSE.
    """
    try:
        # Monta o input: apenas a última mensagem do usuário
        user_messages = [m for m in request.messages if m.role == "user"]
        last_user_input = user_messages[-1].content if user_messages else ""

        # Histórico anterior (sem a última mensagem do usuário)
        history = []
        for m in request.messages[:-1]:
            if m.role in ("user", "assistant"):
                history.append({"role": m.role, "content": m.content})

        payload = {
            "model": settings.AZURE_MODEL_DEPLOYMENT,
            "input": last_user_input,
            "stream": True,
            "temperature": request.temperature,
            "max_output_tokens": request.max_tokens,
        }

        # Adiciona histórico se existir
        if history:
            payload["previous_response_id"] = None  # sem thread persistente
            # Passa histórico como contexto adicional no input
            history_text = "\n".join([f"{m['role'].upper()}: {m['content']}" for m in history])
            payload["input"] = f"[Histórico da conversa]\n{history_text}\n\n[Nova mensagem]\n{last_user_input}"

        endpoint = settings.AZURE_AI_FOUNDRY_ENDPOINT.rstrip("/")
        if "api-version" not in endpoint:
            endpoint = f"{endpoint}?api-version=2024-02-15-preview"

        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint,
            data=body,
            headers={
                "Content-Type": "application/json",
                "api-key": settings.AZURE_API_KEY,
                "Authorization": f"Bearer {settings.AZURE_API_KEY}",
            },
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=60) as response:
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
                    if not line or line == ":":
                        continue
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str == "[DONE]":
                            yield {"data": "[DONE]"}
                            return
                        try:
                            data = json.loads(data_str)
                            # Formato da API /responses do Foundry
                            # Evento: response.output_text.delta
                            event_type = data.get("type", "")
                            if event_type == "response.output_text.delta":
                                delta = data.get("delta", "")
                                if delta:
                                    yield {"data": json.dumps({"content": delta})}
                            elif event_type == "response.completed":
                                yield {"data": "[DONE]"}
                                return
                            elif event_type == "error":
                                yield {"data": json.dumps({"error": data.get("message", "Erro do agente")})}
                                return
                        except json.JSONDecodeError:
                            pass

    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        logger.error(f"HTTPError {e.code}: {error_body}")
        yield {"data": json.dumps({"error": f"Error code: {e.code} - {error_body}"})}
    except Exception as e:
        logger.error(f"Erro ao comunicar com Azure AI Foundry Agent: {str(e)}", exc_info=True)
        yield {"data": json.dumps({"error": f"Erro interno da API: {str(e)}"})}
    finally:
        yield {"data": "[DONE]"}
