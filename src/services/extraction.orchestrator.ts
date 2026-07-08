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
        Logger.error(`Batch ${i + 1} failed permanently after ${MAX_RETRIES} retries. Filling with nulls for alignment.`, error);
        // Push nulls to maintain index alignment with the raw dataset
        for (let j = 0; j < batch.length; j++) {
          allResults.push(null as unknown as AIExtractedRecord);
        }
      }
    }

    Logger.info(`Extraction complete. Successfully extracted ${allResults.length} records.`);
    return allResults;
  }
}
