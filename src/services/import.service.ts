import { CRMField, CSVColumnMapping, ImportResult, ValidationRecord } from '@/core/types/crm';
import { ValidationService } from './validation.service';

export class ImportService {
  /**
   * Processes a full dataset of CSV rows. 
   * Validates each row, separates valid from skipped records, and generates statistics.
   */
  static async processImport(
    rawRows: Record<string, string>[],
    mappings: CSVColumnMapping[],
    schema: CRMField[]
  ): Promise<ImportResult> {
    
    const validRecords: ValidationRecord[] = [];
    const skippedRecords: ValidationRecord[] = [];

    // Process each record
    rawRows.forEach((row, index) => {
      // Skip completely empty rows
      if (Object.values(row).every(val => !val || val.trim() === '')) {
        return;
      }

      const record = ValidationService.validateRecord(row, index, mappings, schema);
      
      if (record.isValid) {
        validRecords.push(record);
      } else {
        skippedRecords.push(record);
      }
    });

    // Simulate database insertion latency for the valid records
    await new Promise(resolve => setTimeout(resolve, 800));

    // Calculate stats
    const totalProcessed = validRecords.length + skippedRecords.length;
    const successRate = totalProcessed === 0 ? 0 : Math.round((validRecords.length / totalProcessed) * 100);

    return {
      stats: {
        totalRecords: totalProcessed,
        importedCount: validRecords.length,
        skippedCount: skippedRecords.length,
        successRate
      },
      validRecords,
      skippedRecords
    };
  }
}
