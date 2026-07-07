import React, { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { DataTable } from './data-table';
import { ImportResult, ValidationRecord } from '@/src/core/types/crm';
import { CheckCircle2, XCircle, RotateCcw, Users, UserX, BarChart3 } from 'lucide-react';

interface ImportResultsProps {
  result: ImportResult;
  onReset: () => void;
}

type ResultTab = 'imported' | 'skipped';

const CRM_DISPLAY_KEYS = [
  'name', 'email', 'mobile_without_country_code', 'company',
  'city', 'crm_status', 'data_source', 'crm_note',
];

function flattenRecords(records: ValidationRecord[]): { headers: string[]; rows: Record<string, string>[] } {
  if (records.length === 0) return { headers: [], rows: [] };
  const headers = CRM_DISPLAY_KEYS;
  const rows = records.map((r) => {
    const row: Record<string, string> = {};
    for (const key of headers) {
      row[key] = String(r.normalizedData?.[key] ?? r.extractedData?.[key as keyof typeof r.extractedData] ?? '');
    }
    return row;
  });
  return { headers, rows };
}

function flattenSkippedRecords(records: ValidationRecord[]): { headers: string[]; rows: Record<string, string>[] } {
  if (records.length === 0) return { headers: [], rows: [] };
  const allHeaders = Object.keys(records[0].originalData);
  const headers = [...allHeaders, 'Errors'];
  const rows = records.map((r) => ({
    ...r.originalData,
    Errors: r.errors.join(' | '),
  }));
  return { headers, rows };
}

export const ImportResults: React.FC<ImportResultsProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<ResultTab>('imported');
  const { stats, validRecords, skippedRecords } = result;

  const importedTable = flattenRecords(validRecords);
  const skippedTable = flattenSkippedRecords(skippedRecords);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <BarChart3 size={16} />,
            label: 'Total Records',
            value: stats.totalRecords,
            variant: 'default' as const,
          },
          {
            icon: <Users size={16} />,
            label: 'Imported',
            value: stats.importedCount,
            variant: 'success' as const,
          },
          {
            icon: <UserX size={16} />,
            label: 'Skipped',
            value: stats.skippedCount,
            variant: stats.skippedCount > 0 ? 'warning' as const : 'default' as const,
          },
          {
            icon: <CheckCircle2 size={16} />,
            label: 'Success Rate',
            value: `${stats.successRate}%`,
            variant: stats.successRate >= 80 ? 'success' as const : 'warning' as const,
          },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-2 mb-1.5 text-[var(--text-secondary)]">
              {stat.icon}
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-[var(--text-primary)] tabular-nums">
                {stat.value}
              </span>
              <Badge variant={stat.variant}>
                {stat.variant === 'success' ? 'Good' : stat.variant === 'warning' ? 'Review' : '—'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className="flex border-b border-[var(--border-default)]">
          <button
            type="button"
            onClick={() => setActiveTab('imported')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'imported'
                ? 'border-[var(--gray-900)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <CheckCircle2 size={14} />
            Imported ({stats.importedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skipped')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'skipped'
                ? 'border-[var(--gray-900)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <XCircle size={14} />
            Skipped ({stats.skippedCount})
          </button>
        </div>

        <div className="p-1">
          {activeTab === 'imported' && importedTable.rows.length > 0 && (
            <DataTable headers={importedTable.headers} rows={importedTable.rows} maxHeight="400px" />
          )}
          {activeTab === 'imported' && importedTable.rows.length === 0 && (
            <div className="py-10 text-center text-xs text-[var(--text-tertiary)]">
              No records were imported.
            </div>
          )}
          {activeTab === 'skipped' && skippedTable.rows.length > 0 && (
            <DataTable headers={skippedTable.headers} rows={skippedTable.rows} maxHeight="400px" />
          )}
          {activeTab === 'skipped' && skippedTable.rows.length === 0 && (
            <div className="py-10 text-center text-xs text-[var(--text-tertiary)]">
              No records were skipped. All data imported successfully.
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="secondary" size="md" onClick={onReset}>
          <RotateCcw size={14} />
          Import Another File
        </Button>
      </div>
    </div>
  );
};
