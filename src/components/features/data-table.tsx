import React from 'react';
import { cn } from '@/lib/utils/cn';

interface DataTableProps {
  headers: string[];
  rows: Record<string, unknown>[];
  maxHeight?: string;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  maxHeight = '360px',
  className,
}) => {
  if (headers.length === 0 || rows.length === 0) return null;

  return (
    <div
      className={cn(
        'overflow-auto border border-[var(--border-default)] rounded-[var(--radius-lg)]',
        className
      )}
      style={{ maxHeight }}
    >
      <table className="w-full text-xs border-collapse min-w-[600px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-[var(--gray-50)] border-b border-[var(--border-default)]">
            <th className="px-3 py-2.5 text-left font-semibold text-[var(--text-secondary)] whitespace-nowrap w-12">
              #
            </th>
            {headers.map((header) => (
              <th
                key={header}
                className="px-3 py-2.5 text-left font-semibold text-[var(--text-secondary)] whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--gray-50)] transition-colors"
            >
              <td className="px-3 py-2 text-[var(--text-tertiary)] font-mono tabular-nums">
                {rowIndex + 1}
              </td>
              {headers.map((header) => (
                <td
                  key={header}
                  className="px-3 py-2 text-[var(--text-primary)] whitespace-nowrap max-w-[200px] truncate"
                  title={String(row[header] ?? '')}
                >
                  {String(row[header] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
