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
          <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-default)]">
            <th
              scope="col"
              className="px-3 py-2.5 text-left font-semibold text-[var(--text-tertiary)] whitespace-nowrap w-10 font-mono"
            >
              #
            </th>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-3 py-2.5 text-left font-semibold text-[var(--text-secondary)] whitespace-nowrap tracking-tight"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--bg-primary)]">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--bg-secondary)] transition-colors duration-75"
            >
              <td className="px-3 py-2.5 text-[var(--text-tertiary)] font-mono tabular-nums select-none">
                {rowIndex + 1}
              </td>
              {headers.map((header) => {
                const value = String(row[header] ?? '');
                const isEmpty = !value;
                const isLongText = value.length > 35;
                return (
                  <td
                    key={header}
                    className={cn(
                      'px-3 py-2.5',
                      isLongText 
                        ? 'min-w-[250px] whitespace-normal break-words' 
                        : 'whitespace-nowrap max-w-[220px] truncate',
                      isEmpty ? 'text-[var(--text-tertiary)] italic' : 'text-[var(--text-primary)]'
                    )}
                    title={value || undefined}
                  >
                    {value || '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
