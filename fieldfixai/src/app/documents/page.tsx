'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { DocumentList } from '@/components/DocumentList';
import { useDocuments } from '@/hooks/useDocuments';

export default function DocumentsPage() {
  const { documents, fetchDocuments, removeDocument, loading } = useDocuments();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    fetchDocuments();
  };

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    fetchDocuments();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ChevronLeft size={20} />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Knowledge Base Documents
          </h1>
          <p className="text-gray-600">
            Upload and manage documents for your knowledge base
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload New Document
          </h2>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Upload PDFs, Word documents, or text files. They will be automatically processed and indexed for the chatbot to search through.
            </p>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Documents ({documents.length})
          </h2>
          <DocumentList
            documents={documents}
            loading={loading}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      </div>
    </div>
  );
}
