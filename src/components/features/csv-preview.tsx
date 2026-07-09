import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import { ParsedCSV } from '@/lib/csv/parser';
import { FileSpreadsheet, Rows3, Columns3, ArrowRight, AlertCircle } from 'lucide-react';

interface CsvPreviewProps {
  csvData: ParsedCSV;
  onConfirmImport: () => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

export const CsvPreview: React.FC<CsvPreviewProps> = ({
  csvData,
  onConfirmImport,
  isLoading,
  error,
  onReset,
}) => {
  const { headers, data } = csvData;

  return (
    <div className="flex flex-col gap-4">

      {/* File summary bar */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-50)] text-[var(--color-success)]">
              <FileSpreadsheet size={17} strokeWidth={1.75} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                CSV Parsed Successfully
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Rows3 size={11} aria-hidden="true" />
                  {data.length} row{data.length !== 1 ? 's' : ''}
                </span>
                <span className="text-[var(--border-strong)]" aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Columns3 size={11} aria-hidden="true" />
                  {headers.length} column{headers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Upload different file
          </Button>
        </div>
      </Card>

      {/* Preview table */}
      <div>
        <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2.5">
          Data Preview
        </h3>
        <DataTable
          headers={headers}
          rows={data.slice(0, 50)}
          maxHeight="320px"
        />
        {data.length > 50 && (
          <p className="text-xs text-[var(--text-tertiary)] mt-2">
            Showing first 50 of {data.length} rows. All rows will be imported.
          </p>
        )}
      </div>

      {/* Action footer */}
      <Card padding="md">
        <div className="flex flex-col gap-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[rgba(220,38,38,0.20)] bg-[rgba(220,38,38,0.06)] px-3.5 py-2.5" role="alert">
              <AlertCircle size={14} className="text-[var(--color-error)] mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-xs text-[var(--color-error)] leading-relaxed">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-[var(--text-tertiary)] hidden sm:block">
              AI will extract and normalize all {data.length} records.
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="secondary" size="md" onClick={onReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onConfirmImport}
                loading={isLoading}
              >
                Start AI Import
                <ArrowRight size={14} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
