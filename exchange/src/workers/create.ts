import * as cron from "node-cron";

interface WorkerOptions {
  function: () => Promise<void>;
  schedule: string;
}

export const createWorker = (options: WorkerOptions) => {
  return {
    start: async () => {
      try {
        cron.schedule(options.schedule, async () => {
          await options.function();
        });
      } catch (e) {
        console.log("Error starting worker", e);
      }
    },
  };
};
