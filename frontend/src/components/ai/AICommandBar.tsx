"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowUp, Square, Paperclip, ChevronDown } from "lucide-react";

interface AICommandBarProps {
  onGenerate: (prompt: string) => void;
  onStop?: () => void;
  isGenerating?: boolean;
  streamText?: string;
}

const SUGGESTIONS = [
  "Criar um dashboard de métricas com gráficos",
  "Gerar uma tela de login minimalista",
  "Montar um formulário de onboarding multi-step",
  "Projetar uma landing page SaaS moderna",
];

export const AICommandBar: React.FC<AICommandBarProps> = ({
  onGenerate,
  onStop,
  isGenerating = false,
  streamText = "",
}) => {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    onGenerate(input.trim());
    setInput("");
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") setShowSuggestions(false);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30">
      {/* Stream feedback */}
      <AnimatePresence>
        {isGenerating && streamText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-medium flex items-center gap-2"
          >
            <Zap size={12} className="text-indigo-500 animate-pulse" />
            <span className="truncate">{streamText}</span>
            <span className="typing-cursor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestion pills */}
      <AnimatePresence>
        {showSuggestions && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mb-2 flex flex-wrap gap-2"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s);
                  setShowSuggestions(false);
                  textareaRef.current?.focus();
                }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-all shadow-sm"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main bar */}
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 8px 40px rgba(79, 70, 229, 0.18), 0 2px 8px rgba(0,0,0,0.06)"
            : "0 4px 24px rgba(0,0,0,0.1)",
        }}
        className={`bg-white/95 backdrop-blur-xl rounded-2xl border transition-colors ${
          focused ? "border-indigo-200" : "border-gray-200/80"
        } p-2 flex items-end gap-2`}
      >
        {/* AI icon */}
        <button
          onClick={() => setShowSuggestions((p) => !p)}
          className={`p-2 rounded-xl transition-colors ${
            showSuggestions ? "bg-indigo-50 text-indigo-600" : "text-indigo-500 hover:bg-indigo-50"
          }`}
          title="Sugestões"
        >
          <Zap size={18} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { setFocused(true); setShowSuggestions(false); }}
          onBlur={() => setFocused(false)}
          placeholder="Descreva a interface que deseja gerar..."
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none py-2 max-h-[120px] leading-relaxed"
          rows={1}
          disabled={isGenerating}
        />

        {/* Attach */}
        <button className="p-2 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-xl transition-colors mb-0.5">
          <Paperclip size={16} />
        </button>

        {/* Send / Stop */}
        {isGenerating ? (
          <button
            onClick={onStop}
            className="p-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl transition-colors mb-0.5"
            title="Parar geração"
          >
            <Square size={15} fill="white" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2.5 rounded-xl transition-all mb-0.5 ${
              input.trim()
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            <ArrowUp size={16} />
          </button>
        )}
      </motion.div>

      <p className="text-center text-[10px] text-gray-300 mt-2">
        Antigravity AI · Powered by Azure AI Foundry · Enter para enviar
      </p>
    </div>
  );
};
