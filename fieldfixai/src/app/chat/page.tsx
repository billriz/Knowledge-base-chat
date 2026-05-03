'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ChatContainer } from '@/components/ChatContainer';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl flex-col sm:min-h-[calc(100vh-4rem)]">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 self-start font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>

        <div className="min-h-0 flex-1">
          <ChatContainer />
        </div>
      </section>
    </main>
  );
}
