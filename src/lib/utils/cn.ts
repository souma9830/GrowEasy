import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely, resolving conflicts.
 * Usage: cn('px-4 py-2', condition && 'bg-red-500', 'px-6')
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
