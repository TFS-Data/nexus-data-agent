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
    <div className="fixed inset-0 flex flex-col w-full overflow-hidden dot-grid bg-[#080808]">
      {/* ── Gradient blobs ── */}
      <div className="blob-left opacity-30 pointer-events-none" />
      <div className="blob-right opacity-30 pointer-events-none" />

      {/* ── Top bar ── */}
      <header className="h-14 sm:h-16 border-b border-white/[0.06] flex items-center justify-between px-3 sm:px-8 lg:px-12 flex-shrink-0 bg-[#080808]/60 backdrop-blur-2xl z-20 relative">
        <div className="flex items-center gap-1.5 sm:gap-4 min-w-0 mr-2 flex-1">
          <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm truncate">
            <span className="font-medium tracking-wide hidden sm:block truncate">Antigravity + Microsoft Foundry</span>
            <span className="font-medium tracking-wide block sm:hidden truncate">Antigravity</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10 flex-shrink-0" />
          <span className="text-white/40 text-xs sm:text-sm font-medium flex-shrink-0 truncate">Nexus</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400/80 font-medium bg-emerald-400/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-400/20">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="hidden sm:inline">Online</span>
          </span>
          {messages.length > 0 && (
            <>
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                title="Salvar conversa como PDF"
              >
                <Download size={14} />
                Exportar PDF
              </button>
              <button
                onClick={() => window.print()}
                className="flex sm:hidden items-center p-1.5 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                title="Salvar conversa como PDF"
              >
                <Download size={14} />
              </button>
              <button
                onClick={clearChat}
                className="px-2.5 sm:px-4 py-1.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-full hover:bg-red-500/20 border border-red-500/20 transition-colors"
              >
                Limpar
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Main content area ── */}
      <div className="flex-1 overflow-hidden relative z-10 flex flex-col min-w-0 w-full">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col w-full items-center justify-center px-4 sm:px-6 overflow-y-auto py-8"
            >
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(1.75rem,6.5vw,4.5rem)] break-words w-full font-semibold leading-[1.08] tracking-tight text-white max-w-4xl mb-4 sm:mb-5 text-center"
              >
                Converse com agentes de<br className="hidden sm:block" />{" "}
                IA especializados em dados
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/50 text-base sm:text-lg font-normal max-w-xl mb-8 sm:mb-12 leading-relaxed text-center px-2"
              >
                Uma experiência moderna para análise de dados, automação e machine learning com Azure AI Foundry.
              </motion.p>

              {/* ── Input box — maior e responsivo ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[95vw] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
              >
                <ChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} large />

                <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-2.5 justify-center">
                  {EXAMPLE_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-[13px] text-white/40 border border-white/5 hover:border-white/20 hover:text-white/60 hover:bg-white/[0.02] transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col overflow-hidden min-w-0 w-full h-full"
            >
              <div className="flex-1 overflow-hidden min-w-0 w-full">
                <ChatContainer messages={messages} />
              </div>

              <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent relative z-20 shrink-0">
                <div className="max-w-3xl mx-auto">
                  <ChatInput onSend={sendMessage} onStop={stop} isLoading={isLoading} />
                  {error && (
                    <div className="text-center text-red-400 text-xs mt-2 bg-red-400/10 py-2 rounded-lg border border-red-400/20 max-w-3xl mx-auto">
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
