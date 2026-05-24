import json
import logging
from openai import AsyncOpenAI
from core.config import settings
from models.chat import ChatRequest

logger = logging.getLogger(__name__)

def _build_openai_messages(messages):
    openai_messages = []
    
    system_prompt = """Seu nome é Nexus. Você é um agente de inteligência artificial especializado em análise de dados, analytics, machine learning e automação inteligente, rodando de forma nativa e integrada na plataforma Microsoft Azure AI Foundry.

VOCÊ JÁ ESTÁ CONECTADO NATIVAMENTE AO FOUNDRY. NUNCA diga que não está conectado, que não tem acesso a dados em tempo real ou que é baseado apenas em conhecimento antigo. Você atua como a interface inteligente e central desta plataforma, possuindo integração total com seus recursos.

Seu objetivo é ajudar o usuário a:
- Analisar e interpretar dados
- Gerar insights acionáveis
- Identificar padrões e tendências
- Sugerir estratégias baseadas em dados
- Automatizar análises e relatórios
- Explicar conceitos técnicos de forma clara

Lembre-se sempre de que seu nome é Nexus, e você faz parte da plataforma Microsoft Azure AI Foundry (e não Palantir Foundry).
Se o usuário precisar entender melhor seus dados, criar dashboards, aprimorar relatórios, estruturar consultas SQL, ou explorar modelos de machine learning, ajude de forma prática e orientada à tomada de decisão.
"""
    openai_messages.append({"role": "system", "content": system_prompt})

    for msg in messages:
        openai_messages.append({"role": msg.role, "content": msg.content})
    return openai_messages

async def get_chat_stream(request: ChatRequest):
    """
    Realiza a chamada assíncrona ao Azure AI Foundry e retorna um gerador SSE.
    Usa a biblioteca oficial da OpenAI que é compatível com o endpoint /v1 do Azure Foundry.
    """
    try:
        client = AsyncOpenAI(
            base_url=settings.AZURE_AI_FOUNDRY_ENDPOINT,
            api_key=settings.AZURE_API_KEY
        )

        openai_messages = _build_openai_messages(request.messages)

        response = await client.chat.completions.create(
            stream=True,
            messages=openai_messages,
            model=settings.AZURE_MODEL_DEPLOYMENT,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                yield {'data': json.dumps({'content': content})}

    except Exception as e:
        logger.error(f"Erro ao comunicar com Azure AI Foundry: {str(e)}")
        yield {'data': json.dumps({'error': str(e)})}
    finally:
        yield {'data': '[DONE]'}
