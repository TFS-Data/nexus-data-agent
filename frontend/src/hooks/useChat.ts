import { useState, useRef, useEffect, useCallback } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: { name: string; url?: string; type?: string }[];
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    if (isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      attachments: attachments?.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file) // para preview visual (imagens, etc)
      }))
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Placeholder for assistant response
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: 'assistant', content: '' },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');
      const response = await fetch(`${apiBase}/api/v1/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o servidor');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) throw new Error('Não foi possível ler o stream');

      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.substring(6);
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.error) {
                  setError(data.error);
                } else if (data.content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Erro ao fazer parse do SSE data:', e);
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Erro inesperado');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading]);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, stop, clearChat };
}
