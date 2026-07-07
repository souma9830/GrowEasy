import React from 'react';
import { cn } from '@/src/lib/utils/cn';

interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className }) => {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)} role="separator">
        <div className="flex-1 h-px bg-[var(--border-default)]" />
        <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 h-px bg-[var(--border-default)]" />
      </div>
    );
  }

  return (
    <hr
      className={cn('h-px border-0 bg-[var(--border-default)]', className)}
    />
  );
};
