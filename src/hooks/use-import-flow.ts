'use client';

import { useReducer, useCallback } from 'react';
import { ParsedCSV } from '@/lib/csv/parser';
import { ImportResult } from '@/core/types/crm';

export type ImportStep = 'upload' | 'preview' | 'processing' | 'results';

export interface ImportState {
  step: ImportStep;
  csvData: ParsedCSV | null;
  apiKey: string;
  result: ImportResult | null;
  error: string | null;
  isLoading: boolean;
}

type ImportAction =
  | { type: 'CSV_PARSED'; payload: ParsedCSV }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'START_IMPORT' }
  | { type: 'IMPORT_SUCCESS'; payload: ImportResult }
  | { type: 'IMPORT_FAILURE'; payload: string }
  | { type: 'RESET' };

const initialState: ImportState = {
  step: 'upload',
  csvData: null,
  apiKey: '',
  result: null,
  error: null,
  isLoading: false,
};

function importReducer(state: ImportState, action: ImportAction): ImportState {
  switch (action.type) {
    case 'CSV_PARSED':
      return {
        ...state,
        step: 'preview',
        csvData: action.payload,
        error: null,
      };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'START_IMPORT':
      return { ...state, step: 'processing', isLoading: true, error: null };
    case 'IMPORT_SUCCESS':
      return {
        ...state,
        step: 'results',
        result: action.payload,
        isLoading: false,
      };
    case 'IMPORT_FAILURE':
      return {
        ...state,
        step: 'preview',
        error: action.payload,
        isLoading: false,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useImportFlow() {
  const [state, dispatch] = useReducer(importReducer, initialState);

  const onCsvParsed = useCallback((data: ParsedCSV) => {
    dispatch({ type: 'CSV_PARSED', payload: data });
  }, []);

  const setApiKey = useCallback((key: string) => {
    dispatch({ type: 'SET_API_KEY', payload: key });
  }, []);

  const startImport = useCallback(() => {
    dispatch({ type: 'START_IMPORT' });
  }, []);

  const onImportSuccess = useCallback((result: ImportResult) => {
    dispatch({ type: 'IMPORT_SUCCESS', payload: result });
  }, []);

  const onImportFailure = useCallback((error: string) => {
    dispatch({ type: 'IMPORT_FAILURE', payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    onCsvParsed,
    setApiKey,
    startImport,
    onImportSuccess,
    onImportFailure,
    reset,
  };
}
