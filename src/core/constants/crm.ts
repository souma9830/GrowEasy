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
You are a highly intelligent data extraction engine.
Your task is to analyze a batch of raw CSV rows (represented as JSON objects) and extract specific fields according to strict rules.

EXTRACT THE FOLLOWING FIELDS FOR EACH ROW:
- created_at: Any date/time mentioned.
- name: Full name of the lead/customer.
- email: The primary email address.
- country_code: The phone country code (e.g., "91", "1") if present.
- mobile_without_country_code: The local phone number digits only.
- company: Company or organization name.
- city: City name.
- state: State/Province name.
- country: Country name.
- lead_owner: Name or email of the person handling the lead.
- crm_status: Infer the status. Must map to ONE of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE. If unknown, leave null.
- crm_note: General notes, remarks, follow-up comments.
- data_source: Infer the source. Must map to ONE of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. Leave null if not matched.
- possession_time: When the lead expects possession.
- description: General description.

SPECIAL INSTRUCTIONS:
- If you detect multiple emails, put the first in "email" and the rest in an array "extra_emails".
- If you detect multiple phones, put the first in "mobile_without_country_code" and the rest in an array "extra_phones".
- Return ONLY a valid JSON array of objects matching this exact structure exactly in the same order as the input rows.
- No markdown, no explanations.

RAW BATCH INPUT:
{batch_json}
`;
