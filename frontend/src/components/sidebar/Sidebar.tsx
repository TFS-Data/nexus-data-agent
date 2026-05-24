import React, { useState } from 'react';
import { MessageSquarePlus, Settings, Menu, X, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNewChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 glass-panel rounded-lg lg:hidden hover:bg-zinc-800 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed inset-y-0 left-0 z-40 w-72 glass-panel border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex-shrink-0">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 border border-primary-500/20 transition-all font-medium"
          >
            <MessageSquarePlus size={18} />
            <span>Novo Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-3">
              Hoje
            </div>
            <div className="space-y-1">
              {[1, 2].map((i) => (
                <button key={i} className="w-full text-left p-3 rounded-lg hover:bg-zinc-800/50 text-zinc-300 transition-colors text-sm truncate flex items-center gap-3 group">
                  <MessageSquarePlus size={16} className="text-zinc-600 group-hover:text-primary-500 transition-colors" />
                  <span>Análise de dados do projeto {i}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800/50 bg-zinc-900/30">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <Zap size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-200 truncate">GPT-4o Agent</div>
              <div className="text-xs text-zinc-500 truncate">Azure AI Foundry</div>
            </div>
          </div>
          
          <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 text-zinc-400 transition-colors text-sm">
            <Settings size={18} />
            <span>Configurações</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};
