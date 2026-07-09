import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, BrainCircuit } from 'lucide-react';

export const ProcessingState: React.FC = () => {
  return (
    <Card padding="lg">
      <div className="flex flex-col items-center justify-center py-12 text-center gap-0">

        {/* Animated icon cluster */}
        <div className="relative mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
            <BrainCircuit size={30} strokeWidth={1.5} className="text-[var(--text-secondary)]" aria-hidden="true" />
          </div>
          {/* Spinner badge */}
          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-primary)] border border-[var(--border-default)] shadow-[var(--shadow-xs)]">
            <Loader2 size={12} className="animate-spin text-[var(--color-success)]" aria-hidden="true" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
          AI is processing your data
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed mb-6">
          Each row is being analyzed, fields extracted, and normalized against the CRM schema.
          This may take a moment for larger files.
        </p>

        {/* Progress bar */}
        <div className="w-52 h-1 rounded-full bg-[var(--bg-tertiary)] overflow-hidden" role="progressbar" aria-label="Processing">
          <div className="h-full w-1/3 rounded-full bg-[var(--brand-600)] animate-[shimmer_1.6s_ease-in-out_infinite]" />
        </div>

        <p className="text-xs text-[var(--text-tertiary)] mt-3">
          Do not close this tab
        </p>
      </div>
    </Card>
  );
};
