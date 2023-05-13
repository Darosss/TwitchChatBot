import { logger } from "./loggerUtil";

interface RetryWitchCatchOptions {
  retryLimit: number;
  retryInterval: number;
  errorMessage?: string;
}

const retryWithCatch = async <T = unknown>(
  apiCall: () => Promise<T>,
  options: RetryWitchCatchOptions = {
    retryLimit: 5,
    retryInterval: 1000
  }
): Promise<T> => {
  const { retryLimit, retryInterval, errorMessage } = options;
  let retries = 0;
  while (retries < retryLimit) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      retries++;
      const errorMsg = `API call failed. Retrying in ${retryInterval * retries}ms... (${retries}/${retryLimit})`;

      logger.error(`${errorMsg} - ${error}`);
      console.error(errorMsg, error);
      await new Promise((resolve) => setTimeout(resolve, retryInterval * retries));
    }
  }
  throw new Error(`API call failed after ${retryLimit} retries. ${errorMessage || ""}`);
};

export default retryWithCatch;
