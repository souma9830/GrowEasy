import React from 'react';
import { cn } from '@/src/lib/utils/cn';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({ children, className }) => {
  return (
    <main
      className={cn(
        'mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10',
        className
      )}
    >
      {children}
    </main>
  );
};
