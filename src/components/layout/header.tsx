'use client';

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import type { FC } from 'react';

type Theme = 'light' | 'dark' | 'system';

const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light',  icon: <Sun size={14} strokeWidth={1.75} />,     label: 'Light' },
  { value: 'dark',   icon: <Moon size={14} strokeWidth={1.75} />,    label: 'Dark' },
  { value: 'system', icon: <Monitor size={14} strokeWidth={1.75} />, label: 'System' },
];

export const Header: FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--text-primary)]">
            <span className="text-xs font-bold text-[var(--bg-primary)] leading-none">G</span>
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            GrowEasy
          </span>
          <span className="hidden sm:inline-block text-xs text-[var(--text-tertiary)] border-l border-[var(--border-default)] pl-2.5 ml-0.5">
            CSV Importer
          </span>
        </div>

        {/* Right side: Theme toggle + Avatar */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle — segmented control */}
          <div
            role="group"
            aria-label="Theme selection"
            className="flex items-center rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-tertiary)] p-0.5"
          >
            {themeOptions.map((opt) => {
              const isActive = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  aria-pressed={isActive}
                  aria-label={`Switch to ${opt.label} theme`}
                  title={opt.label}
                  className={[
                    'flex h-6 w-7 items-center justify-center rounded-[calc(var(--radius-md)-2px)] transition-all duration-150 focus-ring',
                    isActive
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
                  ].join(' ')}
                >
                  {opt.icon}
                </button>
              );
            })}
          </div>

          {/* Avatar */}
          <span
            className="h-7 w-7 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] flex items-center justify-center text-xs font-semibold text-[var(--text-secondary)]"
            aria-label="User avatar"
          >
            S
          </span>
        </div>
      </div>
    </header>
  );
};
