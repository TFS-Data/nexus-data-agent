"use client";

import React from "react";
import { motion } from "framer-motion";

interface TopBarProps {
  projectName?: string;
  agentStatus?: "ready" | "thinking" | "idle";
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName = "Meu Projeto",
  agentStatus = "ready",
}) => {
  const statusMap = {
    ready: { label: "Agent Ready", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
    thinking: { label: "Gerando...", color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500 animate-pulse" },
    idle: { label: "Aguardando", color: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" },
  };

  const status = statusMap[agentStatus];

  return (
    <header className="h-14 border-b border-gray-200 glass-panel px-5 flex items-center justify-between z-20 flex-shrink-0">
      {/* Left: Logo + Project */}
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-bold tracking-tight">A</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-800 tracking-tight">{projectName}</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400 font-normal">azure-ai-foundry-v1</span>
        </div>
      </div>

      {/* Center: Breadcrumb tabs */}
      <div className="hidden md:flex items-center space-x-1">
        {["Canvas", "Componentes", "Tokens", "Preview"].map((tab, i) => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              i === 0
                ? "bg-gray-100 text-gray-800"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Right: Status + Actions */}
      <div className="flex items-center space-x-3">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </motion.span>

        <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-medium rounded-lg text-gray-700">
          Exportar
        </button>
        <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-xs font-medium rounded-lg text-white shadow-sm">
          Compartilhar
        </button>
      </div>
    </header>
  );
};
