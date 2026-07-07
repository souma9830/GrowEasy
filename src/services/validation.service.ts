import { CRMField, ValidationRecord, CSVColumnMapping } from '@/core/types/crm';
import { cleanPhoneNumber, cleanEmail } from '@/lib/utils/cleaners';

export class ValidationService {
  /**
   * Validates and cleans a raw CSV row based on the established mapping and target CRM schema.
   */
  static validateRecord(
    rawRow: Record<string, string>,
    index: number,
    mappings: CSVColumnMapping[],
    schema: CRMField[]
  ): ValidationRecord {
    const cleanedData: Record<string, string> = {};
    const errors: string[] = [];
    let isValid = true;

    for (const field of schema) {
      const mapping = mappings.find(m => m.crmFieldKey === field.key);
      const csvHeader = mapping?.csvHeader;
      
      let rawValue = '';
      if (csvHeader && rawRow[csvHeader] !== undefined) {
        rawValue = rawRow[csvHeader].trim();
      }

      // Apply specific cleaning rules based on type
      let finalValue = rawValue;
      if (rawValue) {
        if (field.type === 'tel') {
          finalValue = cleanPhoneNumber(rawValue);
          if (!finalValue) {
            errors.push(`${field.label} contains an invalid or empty phone number format.`);
            isValid = false;
          }
        } else if (field.type === 'email') {
          const email = cleanEmail(rawValue);
          if (!email) {
            errors.push(`${field.label} contains an invalid email format.`);
            isValid = false;
          } else {
            finalValue = email;
          }
        }
      }

      // Check required fields
      if (field.required && !finalValue) {
        errors.push(`${field.label} is required but missing.`);
        isValid = false;
      }

      cleanedData[field.key] = finalValue;
    }

    return {
      index,
      originalData: rawRow,
      cleanedData,
      isValid,
      errors
    };
  }
}
