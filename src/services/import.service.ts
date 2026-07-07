import { ImportResult, ValidationRecord } from '@/src/core/types/crm';
import { ExtractionOrchestrator } from './extraction.orchestrator';
import { ValidationService } from './validation.service';
import { Logger } from '@/src/lib/logger/logger';

export class ImportService {
  /**
   * Processes a full dataset of CSV rows using the AI extraction engine. 
   * Orchestrates batching, AI inference, and validation.
   */
  static async processImport(
    rawRows: Record<string, string>[],
    apiKey: string
  ): Promise<ImportResult> {
    
    // Filter out completely empty rows before hitting the AI
    const validRawRows = rawRows.filter(row => 
      !Object.values(row).every(val => !val || val.trim() === '')
    );

    Logger.info(`Starting ImportService for ${validRawRows.length} rows.`);

    // 1. Run the AI Extraction Orchestrator (handles batching & retries)
    const extractedRecords = await ExtractionOrchestrator.processDataset(validRawRows, apiKey);

    const validRecords: ValidationRecord[] = [];
    const skippedRecords: ValidationRecord[] = [];

    // 2. Validate and Normalize each extracted record
    validRawRows.forEach((row, index) => {
      // In case AI returned fewer records or failed a batch, extractedData might be undefined/null
      const extractedData = extractedRecords[index] || null;
      
      const validatedRecord = ValidationService.validateExtractedRecord(row, extractedData, index);
      
      if (validatedRecord.isValid) {
        validRecords.push(validatedRecord);
      } else {
        skippedRecords.push(validatedRecord);
      }
    });

    // 3. Calculate stats
    const totalProcessed = validRecords.length + skippedRecords.length;
    const successRate = totalProcessed === 0 ? 0 : Math.round((validRecords.length / totalProcessed) * 100);

    Logger.info(`Import processing complete. ${validRecords.length} valid, ${skippedRecords.length} skipped.`);

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
