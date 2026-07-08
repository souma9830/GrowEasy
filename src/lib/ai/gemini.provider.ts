import { CRMField, CSVColumnMapping } from '@/core/types/crm';
import { AI_MAPPING_PROMPT_TEMPLATE } from '@/core/constants/crm';
import { IAIMappingProvider, AIProviderConfig } from './provider';

export class GeminiProvider implements IAIMappingProvider {
  
  async mapHeaders(
    csvHeaders: string[],
    sampleRows: Record<string, string>[],
    schema: CRMField[],
    config?: AIProviderConfig
  ): Promise<CSVColumnMapping[]> {
    if (!config?.apiKey) throw new Error('Gemini API key is required');

    const prompt = AI_MAPPING_PROMPT_TEMPLATE
      .replace('{schema_description}', JSON.stringify(schema.map(s => ({ key: s.key, label: s.label, description: s.description })), null, 2))
      .replace('{csv_headers}', JSON.stringify(csvHeaders))
      .replace('{sample_rows}', JSON.stringify(sampleRows, null, 2));

    const model = config.model || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) throw new Error('Empty response from Gemini');
    
    try {
      const jsonMap: Record<string, string | null> = JSON.parse(resultText);
      return schema.map(field => ({
        crmFieldKey: field.key,
        csvHeader: jsonMap[field.key] || null
      }));
    } catch {

      throw new Error('Failed to parse LLM response into valid JSON mapping.');
    }
  }
}
