export const BATCH_SIZE = 10;
export const MAX_RETRIES = 3;

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
