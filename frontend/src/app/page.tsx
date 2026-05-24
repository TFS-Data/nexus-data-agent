"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";

// ─── Example prompts ────────────────────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  "Analisar tendências de vendas",
  "Gerar insights a partir de uma planilha CSV",
  "Criar previsão de demanda",
  "Detectar padrões em dados financeiros",
  "Construir métricas executivas automaticamente",
];

export default function Home() {
  const { messages, isLoading, error, sendMessage, stop, clearChat } = useChat();

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden dot-grid">
      {/* ── Gradient blobs ── */}
      <div className="blob-left opacity-30 pointer-events-none" />
      <div className="blob-right opacity-30 pointer-events-none" />

      {/* ── Top bar ── */}
      <header className="h-16 border-b border-white/[0.06] flex items-center justify-between px-8 lg:px-12 flex-shrink-0 bg-[#080808]/60 backdrop-blur-2xl z-20 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors text-sm group cursor-pointer">
            <span className="font-medium tracking-wide">Antigravity + Microsoft Foundry</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-white/40 text-sm font-medium">Nexus</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm text-emerald-400/80 font-medium bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 mr-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
          {messages.length > 0 && (
            <>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                title="Salvar conversa como PDF"
              >
                <Download size={14} />
                Exportar PDF
              </button>
              <button 
                onClick={clearChat}
                className="px-4 py-1.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-full hover:bg-red-500/20 border border-red-500/20 transition-colors"
              >
                Limpar Chat
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Main content area ── */}
      <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto"
            >
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.08] tracking-tight text-white max-w-4xl mb-5 text-center"
              >
                Converse com agentes de<br />IA especializados em dados
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/50 text-lg font-normal max-w-xl mb-12 leading-relaxed text-center"
              >
                Uma experiência moderna para análise de dados, automação e machine learning com Azure AI Foundry.
              </motion.p>

              <div className="w-full max-w-4xl">
                <ChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} />
                
                <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
                  {EXAMPLE_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="px-3.5 py-2 rounded-full text-[13px] text-white/40 border border-white/5 hover:border-white/20 hover:text-white/60 hover:bg-white/[0.02] transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col overflow-hidden w-full h-full"
            >
              <div className="flex-1 overflow-hidden">
                <ChatContainer messages={messages} />
              </div>
              
              <div className="p-4 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent relative z-20 shrink-0">
                <div className="max-w-4xl mx-auto">
                  <ChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} />
                  {error && (
                    <div className="text-center text-red-400 text-xs mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20 max-w-4xl mx-auto">
                      Erro: {error}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
