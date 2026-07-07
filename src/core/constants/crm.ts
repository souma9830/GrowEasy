import { CRMField } from '../types/crm';

export const TARGET_CRM_SCHEMA: CRMField[] = [
  {
    key: 'name',
    label: 'Full Name',
    required: true,
    description: 'The name of the customer, lead, or client.',
    example: 'John Doe',
    type: 'text'
  },
  {
    key: 'mobile_without_country_code',
    label: 'Mobile Number',
    required: true,
    description: 'WhatsApp, phone, or contact number, cleaned of country codes and symbols.',
    example: '9876543210',
    type: 'tel'
  },
  {
    key: 'email',
    label: 'Email Address',
    required: false,
    description: 'Primary email address of the lead.',
    example: 'john@example.com',
    type: 'email'
  },
  {
    key: 'company',
    label: 'Company Name',
    required: false,
    description: 'The company or organization the lead belongs to.',
    example: 'Acme Corp',
    type: 'text'
  },
  {
    key: 'job_title',
    label: 'Job Title',
    required: false,
    description: 'The designation or role of the lead.',
    example: 'Software Engineer',
    type: 'text'
  },
  {
    key: 'lead_status',
    label: 'Lead Status',
    required: false,
    description: 'Current status of the lead (e.g. New, Contacted, Qualified, Closed).',
    example: 'New',
    type: 'text'
  },
  {
    key: 'notes',
    label: 'Notes / Comments',
    required: false,
    description: 'Any additional details, descriptions, or comments.',
    example: 'Looking for enterprise pricing.',
    type: 'text'
  }
];

export const AI_MAPPING_PROMPT_TEMPLATE = `
You are an intelligent data mapping assistant.
Your task is to map a list of CSV headers to a standardized CRM schema based on semantic meaning.

TARGET CRM SCHEMA:
{schema_description}

SOURCE CSV HEADERS:
{csv_headers}

SAMPLE DATA ROWS:
{sample_rows}

Analyze the headers and sample data to understand the context.
Return ONLY a valid JSON object mapping the CRM field keys to the exact source CSV headers.
If there is no logical match for a CRM field, map it to null.
Do not include markdown blocks or any other text.

Example JSON output format:
{{
  "name": "Customer Full Name",
  "mobile_without_country_code": "WhatsApp Number",
  "email": "Contact Email",
  "company": null,
  "job_title": "Designation",
  "lead_status": "Stage",
  "notes": null
}}
`;
