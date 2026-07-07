'use client';

import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';


interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  accept = '.csv',
  maxSizeMB = 10,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);

      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Only .csv files are supported.');
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File must be under ${maxSizeMB}MB.`);
        return;
      }

      setSelectedFile({ name: file.name, size: file.size, type: file.type });
      onFileSelect?.(file);
    },
    [maxSizeMB, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
      if (inputRef.current) inputRef.current.value = '';
    },
    [validateAndSelect]
  );

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    onFileRemove?.();
  }, [onFileRemove]);

  const handleBrowse = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {!selectedFile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload CSV file"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowse}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrowse(); }}
          className={cn(
            'relative flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed py-12 px-6 cursor-pointer transition-colors duration-[var(--transition-base)]',
            isDragging
              ? 'border-[var(--brand-600)] bg-[var(--brand-50)]'
              : 'border-[var(--gray-300)] bg-[var(--bg-primary)] hover:border-[var(--gray-400)] hover:bg-[var(--gray-50)]',
            'focus-ring'
          )}
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              isDragging ? 'bg-[var(--brand-100)] text-[var(--brand-700)]' : 'bg-[var(--gray-100)] text-[var(--text-tertiary)]'
            )}
          >
            <Upload size={20} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {isDragging ? 'Drop your file here' : 'Drag & drop your CSV file'}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              or <span className="text-[var(--text-primary)] font-medium underline underline-offset-2">browse</span> to
              choose a file · Max {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-primary)] p-4 shadow-[var(--shadow-xs)]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-green-50 text-[var(--color-success)]">
            <File size={18} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {selectedFile.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[var(--text-tertiary)]">
                {formatFileSize(selectedFile.size)}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                <CheckCircle2 size={12} /> Ready
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove file"
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:bg-[var(--gray-100)] hover:text-[var(--text-secondary)] transition-colors focus-ring"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
};
