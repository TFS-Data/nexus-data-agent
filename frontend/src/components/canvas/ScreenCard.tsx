"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

export type CardStatus = "generated" | "skeleton" | "projected";

export interface ScreenCardData {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  emoji?: string;
  accentColor?: string;
  tag?: string;
  content?: React.ReactNode;
}

interface ScreenCardProps {
  card: ScreenCardData;
  index: number;
  onRemove?: (id: string) => void;
}

const SkeletonCard: React.FC = () => (
  <div className="space-y-3 mt-3">
    <div className="skeleton h-5 w-3/4" />
    <div className="skeleton h-3 w-1/2" />
    <div className="skeleton h-24 w-full mt-2" />
    <div className="skeleton h-8 w-full mt-1" />
  </div>
);

export const ScreenCard: React.FC<ScreenCardProps> = ({ card, index, onRemove }) => {
  const isProjected = card.status === "projected";
  const isSkeleton = card.status === "skeleton";

  const accent = card.accentColor ?? "#4f46e5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`screen-card relative w-[360px] bg-white rounded-2xl border shadow-lg select-none ${
        isProjected
          ? "opacity-70 border-dashed border-gray-300"
          : "border-gray-200/80 shadow-lg"
      }`}
      style={{ boxShadow: isProjected ? undefined : "0 8px 40px rgba(0,0,0,0.08)" }}
    >
      {/* Card Header */}
      <div className="p-4 pb-0 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {card.emoji && (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${accent}15` }}
            >
              {card.emoji}
            </div>
          )}
          <div>
            <h3
              className={`text-sm font-semibold leading-tight ${
                isProjected ? "text-gray-400" : "text-gray-900"
              }`}
            >
              {card.title}
            </h3>
            {card.description && (
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{card.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {card.tag && (
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              {card.tag}
            </span>
          )}
          <button
            className="p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
            onClick={() => onRemove?.(card.id)}
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {isSkeleton ? (
          <SkeletonCard />
        ) : isProjected ? (
          <div className="space-y-2 mt-2">
            <div className="h-8 bg-gray-50 rounded-lg border border-gray-100" />
            <div className="h-8 bg-gray-50 rounded-lg border border-gray-100" />
            <div className="h-8 bg-gray-50 rounded-lg border border-gray-100 w-2/3" />
          </div>
        ) : (
          card.content
        )}
      </div>
    </motion.div>
  );
};
