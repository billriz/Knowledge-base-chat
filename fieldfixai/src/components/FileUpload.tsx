'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadFile, loading, error, progress } = useFileUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadFile(selectedFile);
    if (result) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess?.();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={loading}
        className="hidden"
        accept=".pdf,.txt,.md,.docx,.doc,.json"
      />

      {selectedFile ? (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
          <p className="text-xs text-gray-500">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          <div className="flex gap-2 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              disabled={loading}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="mx-auto text-gray-400" size={32} />
          <div>
            <p className="text-sm font-medium text-gray-700">Drop file here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">
              Supported: PDF, TXT, DOCX, MD, JSON (max 50MB)
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
