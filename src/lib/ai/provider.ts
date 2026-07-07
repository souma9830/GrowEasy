import { CRMField, CSVColumnMapping } from '@/core/types/crm';

export interface AIProviderConfig {
  apiKey?: string;
  model?: string;
}

export interface IAIMappingProvider {
  /**
   * Maps CSV headers to the provided CRM schema based on semantic meaning and sample data.
   */
  mapHeaders(
    csvHeaders: string[],
    sampleRows: Record<string, string>[],
    schema: CRMField[],
    config?: AIProviderConfig
  ): Promise<CSVColumnMapping[]>;
}
