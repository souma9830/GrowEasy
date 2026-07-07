import { ImportResult } from '@/core/types/crm';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const BASE_URL = '/api';

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }

  return json.data as T;
}

export const apiClient = {
  /**
   * Sends raw CSV rows and an API key to the backend for AI extraction and import.
   */
  importRecords: (rawRows: Record<string, string>[], apiKey: string): Promise<ImportResult> => {
    return request<ImportResult>('/import', { rawRows, apiKey });
  },
};
