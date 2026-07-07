import React from 'react';
import { Card } from '@/src/components/ui/card';
import { Loader2, BrainCircuit } from 'lucide-react';

export const ProcessingState: React.FC = () => {
  return (
    <Card padding="lg">
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="relative mb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gray-100)]">
            <BrainCircuit size={28} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Loader2 size={18} className="animate-spin text-[var(--brand-600)]" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
          AI is processing your data
        </h3>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
          Each row is being analyzed, fields are being extracted, and data is being
          normalized against the CRM schema. This may take a moment for larger files.
        </p>

        <div className="mt-6 w-48 h-1 rounded-full bg-[var(--gray-200)] overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-[var(--brand-600)] animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </Card>
  );
};
