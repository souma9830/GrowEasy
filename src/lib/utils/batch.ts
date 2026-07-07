/**
 * Splits an array into smaller chunks of a specified size.
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/**
 * Executes an asynchronous task with automatic retries.
 */
export const withRetry = async <T>(
  task: () => Promise<T>,
  maxRetries: number,
  delayMs: number = 1000
): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await task();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      await new Promise(res => setTimeout(res, delayMs * attempt)); // Exponential backoff
    }
  }
  throw new Error("Retry limit exceeded");
};
