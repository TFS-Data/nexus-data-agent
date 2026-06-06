import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: { name: string; url?: string; type?: string }[];
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, attachments }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 p-6 ${isUser ? 'bg-transparent' : 'glass-panel rounded-2xl my-4'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-zinc-800' : 'bg-primary-500/20 text-primary-500'}`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="font-semibold mb-1 text-sm text-zinc-400">
          {isUser ? 'Você' : 'Agente IA'}
        </div>
        
        {attachments && attachments.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {attachments.map((file, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-zinc-800/50 text-xs text-zinc-300 px-3 py-1.5 rounded-xl border border-zinc-700/50">
                <span className="max-w-[200px] truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-invert prose-p:leading-relaxed max-w-none break-words prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:bg-black/50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            <div className="flex space-x-1 mt-2">
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
