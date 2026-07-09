import { AIExtractedRecord } from '@/core/types/crm';
import { AI_EXTRACTION_PROMPT_TEMPLATE } from '@/core/constants/crm';
import { Logger } from '@/lib/logger/logger';

export class AIExtractorService {
  static async extractBatch(
    batchId: number,
    rawRows: Record<string, string>[],
    apiKey: string
  ): Promise<AIExtractedRecord[]> {
    if (!apiKey) throw new Error('Gemini API key is required for extraction.');

    const prompt = AI_EXTRACTION_PROMPT_TEMPLATE.replace(
      '{batch_json}',
      JSON.stringify(rawRows, null, 2)
    );

    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const startTime = Date.now();
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1 // Low temperature for deterministic output
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!resultText) {
        throw new Error('Empty response from Gemini');
      }

      const parsed: AIExtractedRecord[] = JSON.parse(resultText);

      Logger.info(`AI Extraction Batch Success`, {
        batchId,
        processingTimeMs: Date.now() - startTime,
        recordCount: parsed.length
      });

      return parsed;
    } catch (error) {
      Logger.error(`AI Extraction Batch Failed`, error, { batchId, processingTimeMs: Date.now() - startTime });
      throw error;
    }
  }
}
