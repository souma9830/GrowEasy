import { CRMField, CSVColumnMapping } from '@/core/types/crm';
import { IAIMappingProvider, AIProviderConfig } from './provider';

export class MockAIProvider implements IAIMappingProvider {

  async mapHeaders(
    csvHeaders: string[],
    sampleRows: Record<string, string>[],
    schema: CRMField[]
  ): Promise<CSVColumnMapping[]> {

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mappings: CSVColumnMapping[] = [];
    const usedHeaders = new Set<string>();

    for (const field of schema) {
      const fieldKeyLower = field.key.toLowerCase();
      const fieldLabelLower = field.label.toLowerCase();

      let bestMatch: string | null = null;

      for (const header of csvHeaders) {
        if (usedHeaders.has(header)) continue;

        const headerLower = header.toLowerCase();

        // Exact or strong substring match
        if (
          headerLower === fieldKeyLower ||
          headerLower === fieldLabelLower ||
          headerLower.includes(fieldKeyLower) ||
          fieldLabelLower.includes(headerLower)
        ) {
          bestMatch = header;
          break;
        }

        // Specific mock rules based on the prompt description
        if (field.key === 'name' && ['customer name', 'lead', 'client', 'full name', 'first name', 'name'].includes(headerLower)) {
          bestMatch = header;
          break;
        }

        if (field.key === 'mobile_without_country_code' && ['phone', 'mobile', 'whatsapp number', 'contact number', 'phone number'].includes(headerLower)) {
          bestMatch = header;
          break;
        }
      }

      if (bestMatch) {
        usedHeaders.add(bestMatch);
      }

      mappings.push({
        crmFieldKey: field.key,
        csvHeader: bestMatch
      });
    }

    return mappings;
  }
}
