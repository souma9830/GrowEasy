import { CRMField, CSVColumnMapping } from '@/core/types/crm';
import { IAIMappingProvider } from '@/lib/ai/provider';
import { MockAIProvider } from '@/lib/ai/mock.provider';
import { GeminiProvider } from '@/lib/ai/gemini.provider';

export type AIProviderType = 'mock' | 'gemini' | 'anthropic';

export class MappingService {
  /**
   * Orchestrates the mapping process by selecting the appropriate AI provider.
   */
  static async mapHeadersToSchema(
    providerType: AIProviderType,
    apiKey: string | undefined,
    csvHeaders: string[],
    sampleRows: Record<string, string>[],
    schema: CRMField[]
  ): Promise<CSVColumnMapping[]> {
    
    let provider: IAIMappingProvider;

    switch (providerType) {
      case 'gemini':
        provider = new GeminiProvider();
        break;
      // case 'anthropic': provider = new ClaudeProvider(); break; 
      // Note: Anthropic fetch implementation can be added here
      case 'mock':
      default:
        provider = new MockAIProvider();
        break;
    }

    try {
      return await provider.mapHeaders(csvHeaders, sampleRows, schema, { apiKey });
    } catch {

      // Fallback to mock if API fails (e.g. invalid key, rate limit)
      provider = new MockAIProvider();
      return await provider.mapHeaders(csvHeaders, sampleRows, schema, {});
    }
  }
}
