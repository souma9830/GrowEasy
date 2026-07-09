import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  return (
    <div className="flex flex-col gap-2.5" role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] overflow-hidden relative',
            i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full',
            className
          )}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--bg-overlay)] to-transparent animate-[shimmer_1.6s_ease-in-out_infinite]"
            aria-hidden="true"
          />
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
