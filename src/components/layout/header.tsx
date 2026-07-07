import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--gray-900)]">
            <span className="text-xs font-bold text-white leading-none">G</span>
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            GrowEasy
          </span>
          <span className="hidden sm:inline-block text-xs text-[var(--text-tertiary)] border-l border-[var(--border-default)] pl-2.5 ml-0.5">
            CSV Importer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-[var(--gray-200)] flex items-center justify-center text-xs font-medium text-[var(--text-secondary)]">
            S
          </span>
        </div>
      </div>
    </header>
  );
};
