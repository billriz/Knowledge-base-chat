'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, FileUp, Zap } from 'lucide-react';

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    // Lazy load ChatContainer only when needed
    const ChatContainerLazy = dynamic(() => import('@/components/ChatContainer').then(mod => ({ default: mod.ChatContainer })), { ssr: false });
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowChat(false)}
            className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </button>
          <ChatContainerLazy />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            FieldFix AI
          </h1>
          <p className="text-gray-600 mt-2">
            Intelligent Knowledge Base Chat with Document Management
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chat Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <MessageCircle className="text-white mb-2" size={32} />
              <h2 className="text-2xl font-bold text-white">Chat with Your Knowledge Base</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Ask questions about your uploaded documents. The AI will search through your knowledge base and provide intelligent answers based on the content.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <Zap size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Powered by OpenAI GPT-3.5</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Semantic search through documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap size={18} className="text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Context-aware responses</span>
                </li>
              </ul>
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Start Chatting
              </button>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <FileUp className="text-white mb-2" size={32} />
              <h2 className="text-2xl font-bold text-white">Manage Documents</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Upload and manage your knowledge base documents. Supported formats include PDFs, Word documents, and text files.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <Zap size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">PDF, DOCX, TXT, MD support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Automatic text extraction</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap size={18} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Up to 50MB per document</span>
                </li>
              </ul>
              <Link
                href="/documents"
                className="block w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition text-center"
              >
                Manage Documents
              </Link>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload Documents</h3>
              <p className="text-gray-600 text-sm">
                Upload your PDF, Word, or text files to build your knowledge base.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Processing</h3>
              <p className="text-gray-600 text-sm">
                Documents are automatically processed and converted into searchable embeddings.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Answers</h3>
              <p className="text-gray-600 text-sm">
                Ask questions and get intelligent answers based on your documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import dynamic from 'next/dynamic';