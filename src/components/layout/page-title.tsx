import React from 'react';
import { cn } from '@/src/lib/utils/cn';

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  description,
  actions,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="mt-3 sm:mt-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
};
