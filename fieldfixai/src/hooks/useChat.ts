'use client';

import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
  contextsUsed?: number;
  sources?: Array<{
    id: string;
    file_name: string;
  }>;
  excerpts?: Array<{
    source: string;
    text: string;
  }>;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (message: string): Promise<boolean> => {
      if (!message.trim()) return false;

      setLoading(true);
      setError(null);

      try {
        // Add user message to UI optimistically
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          message,
          role: 'user',
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Send to API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }

        const data = await response.json();

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.message,
          role: 'assistant',
          created_at: new Date().toISOString(),
          contextsUsed: data.contextsUsed,
          sources: data.sources,
          excerpts: data.excerpts,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);

        // Remove the optimistically added user message on error
        setMessages((prev) => prev.slice(0, -1));
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/chat');
      if (!response.ok) throw new Error('Failed to load chat history');
      const history = await response.json();
      setMessages(
        history.map((msg: any) => ({
          ...msg,
          id: msg.id,
        }))
      );
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    loadHistory,
    clearMessages,
    loading,
    error,
  };
}
