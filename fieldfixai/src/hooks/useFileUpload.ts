'use client';

import { useState } from 'react';

interface UploadResult {
  id: string;
  fileName: string;
  chunks: number;
  message: string;
}

export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<UploadResult | null> => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setProgress(100);
      return result as UploadResult;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      return false;
    }
  };

  return {
    uploadFile,
    deleteDocument,
    loading,
    error,
    progress,
  };
}
