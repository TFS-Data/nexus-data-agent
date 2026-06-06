import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string, attachments?: File[]) => void;
  onStop?: () => void;
  isLoading: boolean;
  /** Quando true, exibe o textarea maior (modo landing page) */
  large?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onStop, isLoading, large = false }) => {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const maxHeight = large ? 240 : 200;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [input, large]);

  const handleSend = () => {
    if ((input.trim() || files.length > 0) && !isLoading) {
      onSend(input, files);
      setInput('');
      setFiles([]);
      // reset textarea height
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
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
    <div className="relative w-full mx-auto mb-0">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-input rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 flex flex-col shadow-2xl transition-all bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50"
      >
        {/* Arquivos anexados */}
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

        <div className="flex items-end gap-1 sm:gap-2 w-full pt-1">
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 sm:p-3 mb-1 ml-1 sm:ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded-full transition-colors flex-shrink-0"
            title="Anexar arquivo"
          >
            <Paperclip size={18} className="sm:hidden" />
            <Paperclip size={20} className="hidden sm:block" />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envie uma mensagem para o Nexus..."
            className={`w-full flex-1 bg-transparent text-white placeholder-zinc-400 outline-none resize-none text-[14px] sm:text-[15px] leading-relaxed ${
              large
                ? 'py-4 sm:py-5 px-2 sm:px-3 min-h-[56px] sm:min-h-[72px] max-h-[240px]'
                : 'py-3 sm:py-4 px-2 sm:px-3 min-h-[44px] max-h-[200px]'
            }`}
            rows={large ? 3 : 1}
          />

          {isLoading ? (
            <button
              onClick={onStop}
              className="p-2.5 sm:p-3 mb-1 mr-1 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors flex-shrink-0"
              title="Parar geração"
            >
              <Square size={18} fill="currentColor" className="sm:hidden" />
              <Square size={20} fill="currentColor" className="hidden sm:block" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() && files.length === 0}
              className={`p-2.5 sm:p-3 mb-1 mr-1 sm:mr-2 rounded-full transition-colors flex-shrink-0 ${
                input.trim() || files.length > 0
                  ? 'bg-sky-500 text-white hover:bg-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                  : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Send size={18} className="sm:hidden" />
              <Send size={20} className="hidden sm:block" />
            </button>
          )}
        </div>
      </motion.div>

      <div className="text-center mt-2 sm:mt-3 text-[11px] sm:text-xs text-zinc-500">
        Agentes IA podem cometer erros. Considere verificar informações importantes.
      </div>
    </div>
  );
};
