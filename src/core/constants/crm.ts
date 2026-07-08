export const BATCH_SIZE = 10;
export const MAX_RETRIES = 3;

/* ── Phase 1: Header Mapping Constants ── */

import type { CRMField } from '@/core/types/crm';

export const TARGET_CRM_SCHEMA: CRMField[] = [
  { key: 'name', label: 'Name', type: 'text', required: true, description: 'Full name of the lead or customer.' },
  { key: 'mobile_without_country_code', label: 'Mobile Number', type: 'tel', required: true, description: 'Local mobile number without country code.' },
  { key: 'email', label: 'Email', type: 'email', required: false, description: 'Email address.' },
  { key: 'company', label: 'Company', type: 'text', required: false, description: 'Company or organization name.' },
  { key: 'job_title', label: 'Job Title', type: 'text', required: false, description: 'Job title or role.' },
  { key: 'lead_status', label: 'Lead Status', type: 'select', required: false, description: 'Status of the lead.' },
  { key: 'notes', label: 'Notes', type: 'text', required: false, description: 'Miscellaneous notes or remarks.' },
];

export const AI_MAPPING_PROMPT_TEMPLATE = `You are a data schema mapping engine. Map the following CSV headers to the CRM schema fields. Return ONLY a valid JSON object where keys are CRM field keys and values are the matching CSV header string or null if no match.

CRM Schema:
{schema_description}

CSV Headers:
{csv_headers}

Sample Rows:
{sample_rows}
`;

/* ── Phase 2: AI Extraction Constants ── */

export const AI_EXTRACTION_PROMPT_TEMPLATE = `
You are a highly intelligent data extraction engine for a CRM system.
Your task is to analyze a batch of raw CSV rows (represented as JSON objects with arbitrary column names) and extract specific fields.

The CSV columns may have ANY names — "Full Name", "Contact Number", "Mail ID", "Phone", "Remarks", etc. You must intelligently map them to the correct CRM fields regardless of column naming conventions.

EXTRACT THE FOLLOWING FIELDS FOR EACH ROW:
- created_at: Any date/time field. Must be parseable by JavaScript new Date(). Use ISO 8601 format if possible (e.g. "2026-05-13T14:20:48").
- name: Full name of the lead/customer. Combine first name + last name if they are in separate columns.
- email: The primary email address. Look for columns like "Email", "Mail ID", "Email Address", "E-mail", etc.
- country_code: The phone country code (e.g., "91", "1") if present. Extract from the phone number if embedded (e.g. "+91 98765..." → country_code = "91").
- mobile_without_country_code: The local phone number digits only, without country code. Strip spaces, dashes, and brackets. Look for columns like "Phone", "Mobile", "Contact Number", "WhatsApp Number", etc.
- company: Company or organization name.
- city: City name.
- state: State or Province name.
- country: Country name.
- lead_owner: Name or email of the person handling the lead.
- crm_status: Infer the status. Must be EXACTLY one of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE. If you cannot confidently determine it, use null.
- crm_note: General notes, remarks, follow-up comments. Look for columns like "Remarks", "Notes", "Comments", "Description", "Follow-up", etc.
- data_source: Infer the source. Must be EXACTLY one of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. If none match confidently, use null.
- possession_time: When the lead expects possession of property.
- description: Any additional description or details.

CRITICAL RULES:
1. If you detect multiple emails in a row, put the FIRST in "email" and the rest in "extra_emails" array.
2. If you detect multiple phone numbers in a row, put the FIRST in "mobile_without_country_code" and the rest in "extra_phones" array.
3. Return ONLY a valid JSON array of objects matching this exact structure.
4. Return records in THE SAME ORDER as the input rows.
5. The array length MUST equal the number of input rows.
6. If a field cannot be determined from the data, set it to null.
7. Do NOT skip any rows. Return an entry for every input row.
8. No markdown formatting, no explanations, no backticks — ONLY raw JSON.

RAW BATCH INPUT:
{batch_json}
`;
