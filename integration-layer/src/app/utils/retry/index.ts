export type OperationFunction<T> = () => Promise<T>;

export const retry = async <T>(
  operation: OperationFunction<T>,
  retries: number = 3,
  delay: number = 500
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(operation, retries - 1, delay);
  }
};
