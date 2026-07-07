import { AIExtractedRecord, ValidationRecord, CrmStatusEnum, DataSourceEnum } from '@/src/core/types/crm';
import { cleanPhoneNumber, cleanEmail, formatDateISO } from '@/src/lib/utils/cleaners';

export class ValidationService {
  /**
   * Validates and normalizes an AI extracted record against strict CRM rules.
   */
  static validateExtractedRecord(
    rawRow: Record<string, string>,
    extractedRow: AIExtractedRecord | null,
    index: number
  ): ValidationRecord {
    const errors: string[] = [];
    const normalizedData: Record<string, unknown> = {};

    if (!extractedRow) {
      return {
        index,
        originalData: rawRow,
        extractedData: null,
        normalizedData,
        isValid: false,
        errors: ['AI extraction failed or returned null for this record.']
      };
    }

    // 1. Clean Core Contact Info
    const primaryPhone = cleanPhoneNumber(extractedRow.mobile_without_country_code || '');
    const primaryEmail = cleanEmail(extractedRow.email || '');

    // 2. Missing Contact Rule (Skip if BOTH are missing)
    if (!primaryPhone && !primaryEmail) {
      errors.push('Record skipped: Both mobile number and email are missing or invalid.');
    }

    // 3. Compile Notes & Unused Contacts
    let finalNote = extractedRow.crm_note || '';
    if (extractedRow.extra_emails && extractedRow.extra_emails.length > 0) {
      finalNote += `\nAdditional Emails: ${extractedRow.extra_emails.join(', ')}`;
    }
    if (extractedRow.extra_phones && extractedRow.extra_phones.length > 0) {
      finalNote += `\nAdditional Phones: ${extractedRow.extra_phones.join(', ')}`;
    }

    // 4. Validate & Normalize Enums
    const statusResult = CrmStatusEnum.safeParse(extractedRow.crm_status);
    const finalStatus = statusResult.success ? statusResult.data : null;

    const sourceResult = DataSourceEnum.safeParse(extractedRow.data_source);
    const finalSource = sourceResult.success ? sourceResult.data : '';

    // 5. Build Normalized Payload
    normalizedData.created_at = formatDateISO(extractedRow.created_at);
    normalizedData.name = extractedRow.name || '';
    normalizedData.email = primaryEmail || '';
    normalizedData.country_code = extractedRow.country_code || '';
    normalizedData.mobile_without_country_code = primaryPhone || '';
    normalizedData.company = extractedRow.company || '';
    normalizedData.city = extractedRow.city || '';
    normalizedData.state = extractedRow.state || '';
    normalizedData.country = extractedRow.country || '';
    normalizedData.lead_owner = extractedRow.lead_owner || '';
    normalizedData.crm_status = finalStatus;
    normalizedData.crm_note = finalNote.trim();
    normalizedData.data_source = finalSource;
    normalizedData.possession_time = formatDateISO(extractedRow.possession_time);
    normalizedData.description = extractedRow.description || '';

    // If name is fundamentally required by the schema, check it
    if (!normalizedData.name) {
      errors.push('Name is required but missing.');
    }

    const isValid = errors.length === 0;

    return {
      index,
      originalData: rawRow,
      extractedData: extractedRow,
      normalizedData,
      isValid,
      errors
    };
  }
}
