export type JobWorkerConfig = ReturnType<typeof getCronJobWorkerConfig>;
export const getCronJobWorkerConfig = (_env: unknown = process.env) => {
  return {
    jobWorker: {
      parcelImportService: {
        rule: "0 0 * * *",
        name: "ImportParcelsCronJob",
      },
    },
  };
};
