import { AIExtractedRecord } from '@/core/types/crm';
import { BATCH_SIZE, MAX_RETRIES } from '@/core/constants/crm';
import { chunkArray, withRetry } from '@/lib/utils/batch';
import { AIExtractorService } from '@/lib/ai/extractor';
import { Logger } from '@/lib/logger/logger';

export class ExtractionOrchestrator {
  /**
   * Orchestrates the batching, AI extraction, and retries for a large CSV dataset.
   */
  static async processDataset(rawRows: Record<string, string>[], apiKey: string): Promise<AIExtractedRecord[]> {
    const batches = chunkArray(rawRows, BATCH_SIZE);
    Logger.info(`Starting extraction for ${rawRows.length} rows in ${batches.length} batches.`);

    const allResults: AIExtractedRecord[] = [];

    // Process batches sequentially to respect rate limits
    // In an enterprise system, this could use a worker pool with strict concurrency limits
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        const batchResults = await withRetry(
          () => AIExtractorService.extractBatch(i + 1, batch, apiKey),
          MAX_RETRIES
        );
        allResults.push(...batchResults);
      } catch (error) {
        Logger.error(`Batch ${i + 1} failed permanently after ${MAX_RETRIES} retries. Skipping batch.`, error);
        // We push nulls to maintain index alignment with the raw dataset if needed, 
        // or we simply skip. We'll skip here, but log it.
        // For alignment, we could push null records.
      }
    }

    Logger.info(`Extraction complete. Successfully extracted ${allResults.length} records.`);
    return allResults;
  }
}
