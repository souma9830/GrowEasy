import { z } from 'zod';

/* ── Phase 1: Header Mapping Types ── */

export interface CRMField {
  key: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'select' | 'date';
  required: boolean;
  description: string;
}

export interface CSVColumnMapping {
  crmFieldKey: string;
  csvHeader: string | null;
}

/* ── Phase 2: AI Extraction Types ── */

export const CrmStatusEnum = z.enum([
  'GOOD_LEAD_FOLLOW_UP',
  'DID_NOT_CONNECT',
  'BAD_LEAD',
  'SALE_DONE',
]);
export type CrmStatus = z.infer<typeof CrmStatusEnum>;

export const DataSourceEnum = z.enum([
  'leads_on_demand',
  'meridian_tower',
  'eden_park',
  'varah_swamy',
  'sarjapur_plots',
]);
export type DataSource = z.infer<typeof DataSourceEnum>;

// Represents the expected structured output from the AI for a single row
export interface AIExtractedRecord {
  created_at: string | null;
  name: string | null;
  email: string | null;
  country_code: string | null;
  mobile_without_country_code: string | null;
  company: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  lead_owner: string | null;
  crm_status: string | null; // Extracted as string, normalized later
  crm_note: string | null;
  data_source: string | null; // Extracted as string, normalized later
  possession_time: string | null;
  description: string | null;
  // Extra arrays collected by the AI
  extra_emails?: string[];
  extra_phones?: string[];
}

export interface ValidationRecord {
  index: number;
  originalData: Record<string, string>;
  extractedData: AIExtractedRecord | null;
  normalizedData: Record<string, unknown>;
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
