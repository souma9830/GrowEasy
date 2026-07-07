import React from 'react';
import { cn } from '@/src/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  return (
    <div className="flex flex-col gap-2.5" role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 rounded-[var(--radius-sm)] bg-[var(--gray-200)] animate-pulse',
            // Make lines slightly different widths for visual realism
            i === lines - 1 && lines > 1 ? 'w-3/5' : 'w-full',
            className
          )}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
