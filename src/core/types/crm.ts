export type CRMFieldType = 'text' | 'email' | 'tel';

export interface CRMField {
  key: string;
  label: string;
  required: boolean;
  description: string;
  example: string;
  type: CRMFieldType;
}

export interface CSVColumnMapping {
  crmFieldKey: string;
  csvHeader: string | null;
}

export interface ValidationRecord {
  index: number;
  originalData: Record<string, string>;
  cleanedData: Record<string, string>;
  isValid: boolean;
  errors: string[];
}

export interface ImportStats {
  totalRecords: number;
  importedCount: number;
  skippedCount: number;
  successRate: number;
}

export interface ImportResult {
  stats: ImportStats;
  validRecords: ValidationRecord[];
  skippedRecords: ValidationRecord[];
}
