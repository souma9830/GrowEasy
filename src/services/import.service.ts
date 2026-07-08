import { ImportResult, ValidationRecord } from '@/core/types/crm';
import { ExtractionOrchestrator } from './extraction.orchestrator';
import { ValidationService } from './validation.service';
import { Logger } from '@/lib/logger/logger';
import connectDB from '@/lib/db/mongoose';
import { CrmLeadRepository } from '@/lib/db/repositories/crm-lead.repository';
import { ImportSessionRepository } from '@/lib/db/repositories/import-session.repository';
import { AIExtractedRecord } from '@/core/types/crm';

export class ImportService {

  static async processImport(
    rawRows: Record<string, string>[],
    apiKey: string
  ): Promise<ImportResult> {

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

    const totalProcessed = validRecords.length + skippedRecords.length;
    const successRate = totalProcessed === 0 ? 0 : Math.round((validRecords.length / totalProcessed) * 100);

    const stats = {
      totalRecords: totalProcessed,
      importedCount: validRecords.length,
      skippedCount: skippedRecords.length,
      successRate
    };

    // 4. Persist to MongoDB
    try {
      await connectDB();

      const sessionName = `Import_${new Date().toISOString().replace(/[:.]/g, '-')}`;
      const session = await ImportSessionRepository.create(sessionName, stats);

      if (validRecords.length > 0) {
        // Extract just the normalized data (which matches AIExtractedRecord / ICrmLead shape)
        const recordsToInsert = validRecords.map(r => r.normalizedData as unknown as AIExtractedRecord);
        await CrmLeadRepository.insertMany(recordsToInsert, session._id.toString());
      }
    } catch (dbError) {
      Logger.error('Database persistence failed, but returning import results anyway.', dbError);
    }

    Logger.info(`Import processing complete. ${validRecords.length} valid, ${skippedRecords.length} skipped.`);

    return {
      stats,
      validRecords,
      skippedRecords
    };
  }
}
