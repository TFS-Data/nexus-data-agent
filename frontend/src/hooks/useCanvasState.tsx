"use client";

import { useState, useCallback } from "react";
import { ScreenCardData } from "@/components/canvas/ScreenCard";

let idCounter = 1;
const uid = () => `card-${idCounter++}`;

// Example default cards to populate the canvas on first load
const DEFAULT_CARDS: ScreenCardData[] = [
  {
    id: uid(),
    title: "Dashboard Principal",
    description: "Visão geral de métricas e KPIs em tempo real.",
    status: "generated",
    emoji: "📊",
    tag: "Component",
    accentColor: "#4f46e5",
    content: (
      <div>
        <div className="mt-3 h-28 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-xs font-medium">
          [ Gráfico de Linhas ]
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["R$ 48k", "1.2k", "98%"].map((v, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
              <div className="text-sm font-bold text-gray-900">{v}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                {["Receita", "Usuários", "Uptime"][i]}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-700 transition-colors">
          Ver relatório detalhado
        </button>
      </div>
    ),
  },
  {
    id: uid(),
    title: "Fluxo de Configurações",
    description: "Painel de preferências e personalização.",
    status: "projected",
    emoji: "⚙️",
    tag: "Projetado",
    accentColor: "#f59e0b",
  },
  {
    id: uid(),
    title: "Carregando interface...",
    description: "O agente está gerando os componentes.",
    status: "skeleton",
    emoji: "✦",
    tag: "Gerando",
    accentColor: "#10b981",
  },
];

export type AgentStatus = "ready" | "thinking" | "idle";

export function useCanvasState() {
  const [cards, setCards] = useState<ScreenCardData[]>(DEFAULT_CARDS);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("ready");
  const [streamText, setStreamText] = useState("");
  const [activeScreenId, setActiveScreenId] = useState<string>(DEFAULT_CARDS[0].id);

  const addSkeletonCard = useCallback((prompt: string): string => {
    const id = uid();
    const newCard: ScreenCardData = {
      id,
      title: "Gerando interface...",
      description: prompt.length > 60 ? prompt.substring(0, 60) + "..." : prompt,
      status: "skeleton",
      emoji: "✦",
      tag: "Gerando",
      accentColor: "#4f46e5",
    };
    setCards((prev) => [...prev, newCard]);
    setActiveScreenId(id);
    return id;
  }, []);

  const resolveCard = useCallback((id: string, title: string, content: React.ReactNode) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, title, status: "generated", content, tag: "Gerado", description: undefined }
          : c
      )
    );
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addProjectedCard = useCallback((name: string) => {
    const id = uid();
    const card: ScreenCardData = {
      id,
      title: name,
      status: "projected",
      emoji: "□",
      tag: "Projetado",
      accentColor: "#6b7280",
    };
    setCards((prev) => [...prev, card]);
    setActiveScreenId(id);
  }, []);

  const screens = cards.map((c) => ({ id: c.id, name: c.title }));

  return {
    cards,
    screens,
    activeScreenId,
    agentStatus,
    streamText,
    setAgentStatus,
    setStreamText,
    setActiveScreenId,
    addSkeletonCard,
    resolveCard,
    removeCard,
    addProjectedCard,
  };
}
