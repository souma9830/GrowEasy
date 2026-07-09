import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-85 active:opacity-75',
  secondary:
    'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] active:bg-[var(--gray-200)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:bg-[var(--gray-200)]',
  danger:
    'bg-[var(--color-error)] text-white hover:opacity-85 active:opacity-75',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8  px-3   text-xs  gap-1.5',
  md: 'h-9  px-4   text-sm  gap-2',
  lg: 'h-10 px-5   text-sm  gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)]',
          'transition-all duration-[var(--transition-fast)]',
          'focus-ring cursor-pointer select-none',
          'disabled:opacity-40 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
