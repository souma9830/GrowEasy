/**
 * Structured logger for production use.
 * In a real app, this might pipe to DataDog, Winston, or Pino.
 * Here we provide a structured console implementation avoiding API keys.
 */
export const Logger = {
  info: (message: string, context?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...context, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: 'WARN', message, ...context, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: any, context?: Record<string, any>) => {
    const errorDetails = error instanceof Error ? { errorName: error.name, errorMessage: error.message, stack: error.stack } : { rawError: error };
    console.error(JSON.stringify({ level: 'ERROR', message, ...errorDetails, ...context, timestamp: new Date().toISOString() }));
  }
};
