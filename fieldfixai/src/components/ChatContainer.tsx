'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessageComponent } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Loader } from 'lucide-react';

export function ChatContainer() {
  const { messages, sendMessage, loading, error } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">Knowledge Base Chat</h2>
        <p className="text-sm text-gray-600">Ask questions about your documents</p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">No messages yet</p>
              <p className="text-sm">Start a conversation by typing a message below</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))
        )}

        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader className="animate-spin text-blue-500" size={24} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
}
