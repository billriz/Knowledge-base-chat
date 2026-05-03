'use client';

import { ChatMessage } from '@/hooks/useChat';

interface ChatMessageComponentProps {
  message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageComponentProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.message}
        </p>
        {message.contextsUsed !== undefined && !isUser && (
          <div className="mt-2 space-y-1 text-xs opacity-75">
            <p>Used {message.contextsUsed} source(s)</p>
            {message.sources && message.sources.length > 0 && (
              <p>
                Sources:{' '}
                {message.sources.map((source) => source.file_name).join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
