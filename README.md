<div align="center">

# 🤖 Nexus Data Agent

**Agente de Inteligência Artificial especializado em Dados, Analytics e Business Intelligence**

*Powered by Microsoft Azure AI Foundry + GPT-4.1*

---

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Azure AI](https://img.shields.io/badge/Azure_AI_Foundry-GPT--4.1-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/en-us/products/ai-foundry)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Sobre o Projeto

O **Nexus Data Agent** é uma plataforma de inteligência artificial conversacional desenvolvida para profissionais de dados. Construída com uma interface moderna e fluida, semelhante ao ChatGPT, integra-se nativamente ao **Microsoft Azure AI Foundry** para oferecer um agente especializado em análise de dados, analytics avançada e automação inteligente.

O **Nexus** foi projetado para ser o copiloto de dados da sua organização — capaz de interpretar informações complexas, sugerir estratégias baseadas em dados e automatizar análises em linguagem natural.

### 🌐 Ambiente ao Vivo (Produção)
Você pode testar a aplicação rodando agora mesmo na nuvem:
👉 **[Acessar o Nexus Data Agent](https://nexus-data-agent.vercel.app)**

*(O backend está hospedado com segurança no Render e o frontend na Vercel).*

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 💬 **Chat Conversacional** | Interface fluida com streaming de respostas em tempo real |
| 🧠 **Agente Especialista** | Nexus é treinado para análise de dados, BI, ML e SQL |
| 📎 **Upload de Arquivos** | Suporte a anexos de arquivos diretamente no chat |
| 📄 **Exportar PDF** | Gere um PDF de toda a conversa com um clique |
| 🌙 **Dark Mode Nativo** | Interface premium com glassmorphism e animações fluidas |
| ⚡ **Streaming SSE** | Respostas exibidas em tempo real via Server-Sent Events |
| 🔒 **Segurança** | Chaves e credenciais isoladas no backend via variáveis de ambiente |
| 🐳 **Docker Compose** | Ambiente completo em um único comando |

---

## 🏗️ Arquitetura do Projeto

```
nexus-data-agent/
│
├── 📁 backend/                    # API REST — FastAPI (Python)
│   ├── 📁 api/
│   │   └── 📁 routes/
│   │       └── chat.py            # Endpoint SSE de streaming do chat
│   ├── 📁 core/
│   │   └── config.py              # Configurações via Pydantic Settings
│   ├── 📁 models/
│   │   └── chat.py                # Modelos de dados (ChatRequest, Message)
│   ├── 📁 services/
│   │   └── azure_ai.py            # Integração com Azure AI Foundry
│   ├── main.py                    # Entrypoint da API + CORS
│   ├── requirements.txt           # Dependências Python
│   ├── Dockerfile                 # Imagem Docker do backend
│   └── .env.example               # Modelo de variáveis de ambiente
│
├── 📁 frontend/                   # Interface Web — Next.js 16 (TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── page.tsx           # Página principal (Single Page Flow)
│   │   │   ├── globals.css        # Design system + estilos globais
│   │   │   └── layout.tsx         # Layout raiz com metadata SEO
│   │   ├── 📁 components/
│   │   │   └── 📁 chat/
│   │   │       ├── ChatContainer.tsx   # Lista de mensagens com scroll
│   │   │       ├── ChatInput.tsx       # Input com upload e animações
│   │   │       └── ChatMessage.tsx     # Balão de mensagem com Markdown
│   │   └── 📁 hooks/
│   │       └── useChat.ts         # Hook de estado e lógica do chat
│   ├── Dockerfile                 # Imagem Docker do frontend
│   └── .env.example               # Modelo de variáveis de ambiente
│
├── docker-compose.yml             # Orquestração Backend + Frontend
└── README.md                      # Esta documentação
```

### Fluxo de Dados

```
Usuário (Browser)
    │
    │  HTTP/SSE
    ▼
Frontend (Next.js :3000)
    │
    │  POST /api/v1/chat/stream  (SSE)
    ▼
Backend (FastAPI :8000)
    │
    │  AsyncOpenAI (streaming)
    ▼
Azure AI Foundry (GPT-4.1)
    │
    │  Stream de tokens
    ▼
Backend → Frontend → Interface (exibição em tempo real)
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- [Python 3.11+](https://python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)
- Uma conta no [Microsoft Azure](https://azure.microsoft.com/) com acesso ao **Azure AI Foundry**

### 1. Clonar o repositório

```bash
git clone https://github.com/TFS-Data/nexus-data-agent.git
cd nexus-data-agent
```

### 2. Configurar o Backend

```bash
cd backend

# Criar e ativar o ambiente virtual Python
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### 3. Configurar Variáveis de Ambiente do Backend

```bash
# Copiar o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Azure:

```env
AZURE_AI_FOUNDRY_ENDPOINT=https://seu-recurso.services.ai.azure.com/api/projects/seu-projeto/openai/v1
AZURE_MODEL_DEPLOYMENT=gpt-4.1
AZURE_API_KEY=SUA_CHAVE_AQUI
```

> 💡 **Onde encontrar suas credenciais?**
> Acesse o [Azure AI Foundry](https://ai.azure.com) → Seu Projeto → **Playgrounds** → **View Code**. Lá você encontrará o endpoint e a chave de API.

### 4. Iniciar o Backend

```bash
# Ainda dentro da pasta backend/
.venv\Scripts\uvicorn.exe main:app --host 127.0.0.1 --port 8000 --reload

# macOS/Linux
.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

A documentação interativa da API estará disponível em: `http://localhost:8000/docs`

### 5. Configurar o Frontend

```bash
# Em outro terminal, acesse a pasta do frontend
cd frontend

# Copiar o arquivo de exemplo
cp .env.example .env.local

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

### 6. Acessar a aplicação

Abra seu navegador em: https://nexus-data-agent.vercel.app

---

## 🐳 Como Rodar com Docker

A maneira mais simples de rodar o projeto completo:

```bash
# Na raiz do projeto
# 1. Configure o backend/.env com suas credenciais Azure
cp backend/.env.example backend/.env
# (edite o arquivo backend/.env com suas chaves)

# 2. Suba todos os serviços
docker compose up --build


---

## 🔧 Variáveis de Ambiente

### Backend (`backend/.env`)

| Variável | Descrição | Obrigatório |
|---|---|---|
| `AZURE_AI_FOUNDRY_ENDPOINT` | URL do endpoint do seu projeto no Foundry | ✅ Sim |
| `AZURE_MODEL_DEPLOYMENT` | Nome do deployment do modelo (ex: `gpt-4.1`) | ✅ Sim |
| `AZURE_API_KEY` | Chave de API do Azure AI Foundry | ✅ Sim |
| `AZURE_OPENAI_ENDPOINT` | Endpoint alternativo OpenAI do Azure | ❌ Opcional |
| `API_V1_STR` | Prefixo da API (padrão: `/api/v1`) | ❌ Opcional |
| `PROJECT_NAME` | Nome exibido na doc da API | ❌ Opcional |
| `CORS_ORIGINS` | Origens permitidas para CORS | ❌ Opcional |

### Frontend (`frontend/.env.local`)

| Variável | Descrição | Obrigatório |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API do backend | ✅ Sim |

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| **Python** | 3.11+ | Linguagem principal do backend |
| **FastAPI** | 0.100+ | Framework web assíncrono |
| **Uvicorn** | Latest | Servidor ASGI |
| **OpenAI SDK** | 1.x | Integração com Azure AI Foundry |
| **Pydantic v2** | 2.x | Validação de dados e configurações |
| **Pydantic Settings** | 2.x | Gerenciamento de variáveis de ambiente |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| **Next.js** | 16.x | Framework React com SSR |
| **TypeScript** | 5.x | Tipagem estática |
| **Tailwind CSS** | 4.x | Estilização utilitária |
| **Framer Motion** | 12.x | Animações e transições |
| **Lucide React** | 1.x | Ícones modernos |
| **React Markdown** | 10.x | Renderização de Markdown nas respostas |

---

## 🗺️ Roadmap

- [x] Interface de chat com streaming em tempo real
- [x] Upload e visualização de arquivos no chat
- [x] Exportação de conversa para PDF
- [x] Design premium com dark mode e animações
- [ ] Processamento real de arquivos CSV/Excel no backend
- [ ] Histórico de conversas persistido em banco de dados
- [ ] Autenticação de usuários (Azure AD / OAuth)
- [ ] Suporte a múltiplos agentes especializados
- [ ] Integração com Power BI Embedded
- [ ] Geração automática de dashboards a partir de dados



Desenvolvido  por **TFS-Data**

*Nexus — Inteligência que transforma dados em decisões*
