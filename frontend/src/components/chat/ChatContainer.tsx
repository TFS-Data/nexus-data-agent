import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { Message } from '@/hooks/useChat';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatContainerProps {
  messages: Message[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="h-full w-full overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-2 pb-12">
        {messages.map((msg, index) => (
          <ChatMessage key={msg.id || index} role={msg.role} content={msg.content} attachments={msg.attachments} />
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
