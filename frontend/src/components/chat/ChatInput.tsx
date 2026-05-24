import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string, attachments?: File[]) => void;
  onStop?: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, isLoading }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if ((input.trim() || files.length > 0) && !isLoading) {
      onSend(input, files);
      setInput('');
      setFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
    // clear input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-input rounded-3xl p-2 flex flex-col shadow-2xl transition-all bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50"
      >
        {/* Renderização de arquivos anexados */}
        {files.length > 0 && (
          <div className="flex gap-2 p-2 flex-wrap border-b border-zinc-800">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-zinc-800 text-xs text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700">
                <Paperclip size={12} className="text-zinc-400" />
                <span className="max-w-[120px] truncate">{f.name}</span>
                <button 
                  onClick={() => removeFile(i)}
                  className="ml-1 hover:text-white rounded-full bg-zinc-700 hover:bg-zinc-600 w-4 h-4 flex items-center justify-center transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 w-full pt-1">
          <input 
            type="file" 
            multiple 
            hidden 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 mb-1 ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors flex-shrink-0"
            title="Anexar arquivo"
          >
            <Paperclip size={20} />
          </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Envie uma mensagem para o Nexus..."
          className="w-full bg-transparent text-white placeholder-zinc-400 py-4 px-3 outline-none resize-none max-h-[200px] text-[15px] leading-relaxed"
          rows={1}
        />
        
        {isLoading ? (
          <button
            onClick={onStop}
            className="p-3 mb-1 mr-1 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
            title="Parar geração"
          >
            <Square size={20} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() && files.length === 0}
            className={`p-3 mb-1 mr-2 rounded-full transition-colors ${
              input.trim() || files.length > 0
                ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        )}
        </div>
      </motion.div>
      <div className="text-center mt-3 text-xs text-zinc-500">
        Agentes IA podem cometer erros. Considere verificar informações importantes.
      </div>
    </div>
  );
};
