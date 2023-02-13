const retryWithCatch = async <T = unknown>(
  apiCall: () => Promise<T>,
  retryLimit: number = 3,
  retryInterval: number = 1000
): Promise<T> => {
  let retries = 0;
  while (retries < retryLimit) {
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      retries++;
      console.error(
        `API call failed. Retrying in ${
          retryInterval * retries
        }ms... (${retries}/${retryLimit})`,
        error
      );
      await new Promise((resolve) =>
        setTimeout(resolve, retryInterval * retries)
      );
    }
  }
  throw new Error(`API call failed after ${retryLimit} retries.`);
};

export default retryWithCatch;
