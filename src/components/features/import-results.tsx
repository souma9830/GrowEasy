import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from './data-table';
import { EmptyState } from '@/components/ui/states';
import { ImportResult, ValidationRecord } from '@/core/types/crm';
import {
  CheckCircle2, XCircle, RotateCcw,
  Users, UserX, BarChart3, TrendingUp,
} from 'lucide-react';

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
  const headers = [...allHeaders, 'Skip Reason'];
  const rows = records.map((r) => ({
    ...r.originalData,
    'Skip Reason': r.errors.join(' · '),
  }));
  return { headers, rows };
}

export const ImportResults: React.FC<ImportResultsProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<ResultTab>('imported');
  const { stats, validRecords, skippedRecords } = result;

  const importedTable = flattenRecords(validRecords);
  const skippedTable = flattenSkippedRecords(skippedRecords);

  const statCards = [
    {
      icon: <BarChart3 size={15} aria-hidden="true" />,
      label: 'Total Records',
      value: stats.totalRecords,
      badge: null,
      badgeVariant: 'default' as const,
    },
    {
      icon: <Users size={15} aria-hidden="true" />,
      label: 'Imported',
      value: stats.importedCount,
      badge: 'Imported',
      badgeVariant: 'success' as const,
    },
    {
      icon: <UserX size={15} aria-hidden="true" />,
      label: 'Skipped',
      value: stats.skippedCount,
      badge: stats.skippedCount > 0 ? 'Review' : 'Clean',
      badgeVariant: (stats.skippedCount > 0 ? 'warning' : 'success') as 'warning' | 'success',
    },
    {
      icon: <TrendingUp size={15} aria-hidden="true" />,
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      badge: stats.successRate >= 80 ? 'Good' : 'Review',
      badgeVariant: (stats.successRate >= 80 ? 'success' : 'warning') as 'success' | 'warning',
    },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className="flex items-center gap-1.5 mb-2 text-[var(--text-tertiary)]">
              {stat.icon}
              <span className="text-xs font-medium text-[var(--text-secondary)]">{stat.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold text-[var(--text-primary)] tabular-nums leading-none">
                {stat.value}
              </span>
              {stat.badge && (
                <Badge variant={stat.badgeVariant} className="mb-0.5">
                  {stat.badge}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs + table */}
      <Card padding="none">
        {/* Tab bar */}
        <div className="flex items-center border-b border-[var(--border-default)] px-1">
          {(
            [
              { id: 'imported' as const, icon: <CheckCircle2 size={13} aria-hidden="true" />, label: 'Imported', count: stats.importedCount },
              { id: 'skipped'  as const, icon: <XCircle size={13} aria-hidden="true" />,      label: 'Skipped',  count: stats.skippedCount  },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 -mb-px transition-colors focus-ring rounded-t-sm',
                activeTab === tab.id
                  ? 'border-[var(--text-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)]',
              ].join(' ')}
            >
              {tab.icon}
              {tab.label}
              <span className={[
                'ml-0.5 rounded-full px-1.5 py-0 text-[10px] font-semibold tabular-nums',
                activeTab === tab.id
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
              ].join(' ')}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'imported' && importedTable.rows.length > 0 && (
            <DataTable headers={importedTable.headers} rows={importedTable.rows} maxHeight="400px" />
          )}
          {activeTab === 'imported' && importedTable.rows.length === 0 && (
            <EmptyState
              title="No records imported"
              description="No records met the validation criteria. Check the Skipped tab for details."
            />
          )}
          {activeTab === 'skipped' && skippedTable.rows.length > 0 && (
            <DataTable headers={skippedTable.headers} rows={skippedTable.rows} maxHeight="400px" />
          )}
          {activeTab === 'skipped' && skippedTable.rows.length === 0 && (
            <EmptyState
              title="No records skipped"
              description="All records were imported successfully."
            />
          )}
        </div>
      </Card>

      {/* Footer action */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-tertiary)]">
          {stats.importedCount} record{stats.importedCount !== 1 ? 's' : ''} saved to the CRM database.
        </p>
        <Button variant="secondary" size="md" onClick={onReset}>
          <RotateCcw size={13} aria-hidden="true" />
          Import Another File
        </Button>
      </div>
    </div>
  );
};
