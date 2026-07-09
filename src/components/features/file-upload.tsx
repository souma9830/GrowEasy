'use client';

import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';

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

      {/* Drop zone */}
      {!selectedFile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload CSV file. Drag and drop or press Enter to browse."
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowse}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrowse(); }}
          className={cn(
            'relative flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border-2 border-dashed py-14 px-6 cursor-pointer select-none',
            'transition-colors duration-[var(--transition-base)] focus-ring',
            isDragging
              ? 'border-[var(--brand-600)] bg-[var(--brand-50)]'
              : 'border-[var(--border-strong)] bg-[var(--bg-primary)] hover:border-[var(--brand-600)] hover:bg-[var(--bg-tertiary)]',
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full transition-colors',
              isDragging
                ? 'bg-[var(--brand-100)] text-[var(--brand-700)]'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
            )}
          >
            <Upload size={20} strokeWidth={1.75} aria-hidden="true" />
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {isDragging ? 'Release to upload' : 'Drag & drop your CSV file'}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              or{' '}
              <span className="text-[var(--text-secondary)] font-medium underline underline-offset-2 decoration-[var(--border-strong)]">
                browse to choose
              </span>
              {' '}· .csv · Max {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {/* Selected file pill */}
      {selectedFile && (
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-primary)] p-3.5 shadow-[var(--shadow-xs)]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--color-success)]">
            <File size={17} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate leading-tight">
              {selectedFile.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[var(--text-tertiary)]">
                {formatFileSize(selectedFile.size)}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                <CheckCircle2 size={11} aria-hidden="true" />
                Ready to import
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove selected file"
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-secondary)] transition-colors focus-ring"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Validation error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-[var(--color-error)]" role="alert" aria-live="assertive">
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </div>
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
