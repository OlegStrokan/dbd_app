export type OperationFunction<T> = () => Promise<T>;

export async function retry<T>(
  operation: OperationFunction<T>,
  retries: number = 3,
  delay: number = 500
): Promise<T> {
  let attempts = 0;

  while (attempts < retries) {
    try {
      return await operation();
    } catch (error) {
      if (attempts === retries - 1) {
        throw error;
      }
      attempts++;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error(
    "Unexpected error: the function should not reach this point."
  );
}
