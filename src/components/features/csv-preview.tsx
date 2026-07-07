import React from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { DataTable } from './data-table';
import { ParsedCSV } from '@/src/lib/csv/parser';
import { FileSpreadsheet, Rows3, Columns3, ArrowRight } from 'lucide-react';

interface CsvPreviewProps {
  csvData: ParsedCSV;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onConfirmImport: () => void;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

export const CsvPreview: React.FC<CsvPreviewProps> = ({
  csvData,
  apiKey,
  onApiKeyChange,
  onConfirmImport,
  isLoading,
  error,
  onReset,
}) => {
  const { headers, data } = csvData;

  return (
    <div className="flex flex-col gap-4">
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--gray-100)] text-[var(--text-secondary)]">
              <FileSpreadsheet size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                CSV Parsed Successfully
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Rows3 size={12} /> {data.length} rows
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                  <Columns3 size={12} /> {headers.length} columns
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Upload different file
          </Button>
        </div>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
          Data Preview
        </h3>
        <DataTable
          headers={headers}
          rows={data.slice(0, 50)}
          maxHeight="320px"
        />
        {data.length > 50 && (
          <p className="text-xs text-[var(--text-tertiary)] mt-2">
            Showing first 50 of {data.length} rows.
          </p>
        )}
      </div>

      <Card padding="md">
        <div className="flex flex-col gap-4">
          <Input
            label="Gemini API Key"
            type="password"
            placeholder="Enter your Google Gemini API key"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            hint="Required for AI-powered extraction. Your key is never stored."
          />

          {error && (
            <p className="text-xs text-[var(--color-error)]" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="md" onClick={onReset}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onConfirmImport}
              disabled={!apiKey.trim()}
              loading={isLoading}
            >
              Start AI Import
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
