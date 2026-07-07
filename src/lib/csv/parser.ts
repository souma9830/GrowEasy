import Papa from 'papaparse';

export interface ParsedCSV {
  headers: string[];
  data: Record<string, string>[];
  errors: Papa.ParseError[];
}

/**
 * Parses a CSV string or File object into an array of objects.
 * Uses papaparse for robust parsing (handles quotes, commas inside fields, etc.).
 */
export const parseCSV = (fileOrString: string | File): Promise<ParsedCSV> => {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(fileOrString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          headers: results.meta.fields || [],
          data: results.data,
          errors: results.errors
        });
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};

/**
 * Extracts a small sample of rows to send to the AI for mapping.
 */
export const extractSampleRows = (data: Record<string, string>[], sampleSize: number = 3): Record<string, string>[] => {
  return data.slice(0, sampleSize);
};
