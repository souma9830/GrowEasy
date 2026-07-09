import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[var(--gray-100)] text-[var(--gray-700)]',
  success: 'bg-[var(--brand-50)] text-[var(--color-success)]',
  warning: 'bg-[rgba(217,119,6,0.10)] text-[var(--color-warning)]',
  error:   'bg-[rgba(220,38,38,0.10)] text-[var(--color-error)]',
  info:    'bg-[rgba(37,99,235,0.10)] text-[var(--color-info)]',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium leading-tight',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
