import { CRMField, CSVColumnMapping } from '@/core/types/crm';

export interface AIProviderConfig {
  apiKey?: string;
  model?: string;
}

export interface IAIMappingProvider {

  mapHeaders(
    csvHeaders: string[],
    sampleRows: Record<string, string>[],
    schema: CRMField[],
    config?: AIProviderConfig
  ): Promise<CSVColumnMapping[]>;
}
