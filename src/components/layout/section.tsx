import React from 'react';
import { cn } from '@/src/lib/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <section className={cn('mt-6', className)}>
      {children}
    </section>
  );
};
