"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Layers, Palette, Monitor, Settings, Plus } from "lucide-react";

export type ScreenItem = {
  id: string;
  name: string;
  active?: boolean;
};

interface DesignSidebarProps {
  screens: ScreenItem[];
  activeScreenId?: string;
  onSelectScreen: (id: string) => void;
  onAddScreen: () => void;
}

const DESIGN_TOKENS = [
  { color: "#4f46e5", name: "Indigo" },
  { color: "#7c3aed", name: "Violet" },
  { color: "#f59e0b", name: "Amber" },
  { color: "#10b981", name: "Emerald" },
  { color: "#111827", name: "Dark" },
  { color: "#f9fafb", name: "Surface" },
];

const FONT_TOKENS = ["Inter", "Geist", "Cal Sans"];

export const DesignSidebar: React.FC<DesignSidebarProps> = ({
  screens,
  activeScreenId,
  onSelectScreen,
  onAddScreen,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("tokens");

  const toggle = (key: string) =>
    setExpandedSection((prev) => (prev === key ? null : key));

  return (
    <aside className="w-60 border-r border-gray-200 bg-white flex flex-col z-10 flex-shrink-0 overflow-hidden">
      {/* Section: Design Tokens */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggle("tokens")}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Design Tokens
            </span>
          </div>
          <ChevronRight
            size={14}
            className={`text-gray-400 transition-transform ${expandedSection === "tokens" ? "rotate-90" : ""}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expandedSection === "tokens" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <p className="text-[10px] font-medium text-gray-400 mb-2 uppercase tracking-wider">Cores</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {DESIGN_TOKENS.map((t) => (
                    <div key={t.color} className="group relative">
                      <div
                        className="token-circle"
                        style={{ backgroundColor: t.color }}
                        title={t.name}
                      />
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.name}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] font-medium text-gray-400 mb-2 uppercase tracking-wider mt-4">Tipografia</p>
                <div className="space-y-1">
                  {FONT_TOKENS.map((f) => (
                    <div
                      key={f}
                      className="text-xs text-gray-600 px-2 py-1 rounded-md hover:bg-gray-50 cursor-pointer flex items-center justify-between group"
                    >
                      <span style={{ fontFamily: f }}>{f}</span>
                      <span className="text-[10px] text-gray-300 group-hover:text-gray-400">Aa</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section: Telas Geradas */}
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => toggle("screens")}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Telas ({screens.length})
            </span>
          </div>
          <ChevronRight
            size={14}
            className={`text-gray-400 transition-transform ${expandedSection === "screens" ? "rotate-90" : ""}`}
          />
        </button>

        <AnimatePresence initial={false}>
          {expandedSection === "screens" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden px-3 pb-3"
            >
              <ul className="space-y-0.5">
                {screens.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => onSelectScreen(s.id)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all ${
                        activeScreenId === s.id
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Monitor size={13} className={activeScreenId === s.id ? "text-indigo-500" : "text-gray-400"} />
                      <span className="truncate">{s.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={onAddScreen}
                className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-dashed border-gray-200 hover:border-indigo-300"
              >
                <Plus size={12} />
                Nova Tela
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Settings */}
      <div className="border-t border-gray-100 p-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings size={14} />
          Configurações do Agente
        </button>
      </div>
    </aside>
  );
};
