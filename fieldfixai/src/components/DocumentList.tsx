'use client';

import React, { useState } from 'react';
import { Trash2, FileText, Loader } from 'lucide-react';
import { Document } from '@/hooks/useDocuments';
import { useFileUpload } from '@/hooks/useFileUpload';

interface DocumentListProps {
  documents: Document[];
  loading?: boolean;
  onDeleteSuccess?: () => void;
}

export function DocumentList({
  documents,
  loading = false,
  onDeleteSuccess,
}: DocumentListProps) {
  const { deleteDocument, loading: deleting, error } = useFileUpload();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (documentId: string) => {
    setDeletingId(documentId);
    const success = await deleteDocument(documentId);
    if (success) {
      onDeleteSuccess?.();
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText size={20} className="text-blue-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {doc.file_name}
              </p>
              <p className="text-xs text-gray-500">
                {(doc.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDelete(doc.id)}
            disabled={deletingId === doc.id}
            className="ml-2 p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50 flex-shrink-0"
            title="Delete document"
          >
            {deletingId === doc.id ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      ))}
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
