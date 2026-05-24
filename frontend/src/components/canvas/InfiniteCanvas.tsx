"use client";

import React, { useRef, useEffect } from "react";
import panzoom from "panzoom";
import { ScreenCard, ScreenCardData } from "./ScreenCard";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

interface InfiniteCanvasProps {
  cards: ScreenCardData[];
  onRemoveCard?: (id: string) => void;
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ cards, onRemoveCard }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panzoomRef = useRef<ReturnType<typeof panzoom> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    panzoomRef.current = panzoom(canvasRef.current, {
      maxZoom: 2.5,
      minZoom: 0.3,
      smoothScroll: true,
      zoomDoubleClickSpeed: 1,
      bounds: false,
      boundsPadding: 0.2,
    });

    return () => {
      panzoomRef.current?.dispose();
    };
  }, []);

  const zoomIn = () => panzoomRef.current?.smoothZoom(
    window.innerWidth / 2, window.innerHeight / 2, 1.3
  );
  const zoomOut = () => panzoomRef.current?.smoothZoom(
    window.innerWidth / 2, window.innerHeight / 2, 0.77
  );
  const resetView = () => {
    panzoomRef.current?.moveTo(0, 0);
    panzoomRef.current?.zoomAbs(0, 0, 1);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden dot-grid bg-[#f9fafb]"
    >
      {/* Panzoom canvas root */}
      <div
        ref={canvasRef}
        id="canvas-root"
        className="absolute top-0 left-0"
        style={{ width: "2400px", height: "1600px" }}
      >
        {/* Cards laid out in a flex row with padding */}
        <div className="flex flex-wrap gap-8 p-24 items-start">
          {cards.map((card, i) => (
            <ScreenCard
              key={card.id}
              card={card}
              index={i}
              onRemove={onRemoveCard}
            />
          ))}
        </div>
      </div>

      {/* Empty state */}
      {cards.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-6xl mb-4 opacity-20">✦</div>
          <p className="text-sm text-gray-400 font-medium">Canvas vazio</p>
          <p className="text-xs text-gray-300 mt-1">Descreva uma interface na barra abaixo para começar</p>
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
        <button
          onClick={zoomIn}
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={resetView}
          className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
          title="Reset View"
        >
          <Maximize size={14} />
        </button>
      </div>

      {/* Coordinates indicator */}
      <div className="absolute bottom-4 left-4 text-[10px] text-gray-300 font-mono select-none pointer-events-none">
        Infinite Canvas · Scroll para navegar · Pinch para zoom
      </div>
    </div>
  );
};
