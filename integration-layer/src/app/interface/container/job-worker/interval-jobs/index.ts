import { logger } from "@root/src/app/core/services/logger";
import { IJobWorkerContainer } from "..";
import { IInvervalJob, IJobScheduler } from "./types";

interface IJobState {
  jobPromise: Promise<void> | null;
  intervalHandle: NodeJS.Timeout;
}
export class InvervalJobScheduler implements IJobScheduler {
  private jobStates: IJobState[] = [];

  constructor(
    private readonly parentContainer: IJobWorkerContainer,
    private readonly jobs: IInvervalJob[]
  ) {}

  start = async (): Promise<void> => {
    if (this.jobStates.length > 0) return;

    this.jobStates = await Promise.all(
      this.jobs.filter((j) => j.enabled).map(this.scheduleInterfaceJob)
    );
  };

  stop = async (): Promise<void> => {
    this.jobStates.forEach(({ intervalHandle }) =>
      clearInterval(intervalHandle)
    );

    await Promise.allSettled(
      this.jobStates.map(({ jobPromise }) => jobPromise ?? Promise.resolve())
    );

    this.jobStates = [];
  };

  private scheduleInterfaceJob = async ({
    name,
    intervalMs,
    zeroIntervalExec,
    job,
  }: IInvervalJob): Promise<IJobState> => {
    const run = async () => {
      if (jobState.jobPromise) {
        logger.warn(
          `Cannot invoke interval job '${name}' because it's already running`
        );
      }

      logger.info(`Invoking interval job '${name}'.`);

      const jobPromise = Promise.resolve(job(this.parentContainer));

      jobState.jobPromise = jobPromise;
      try {
        await jobPromise;
        logger.info(`Interval job ${name} finished`);
      } catch (err) {
        logger.error("Uncaught interval job error");
      } finally {
        jobState.jobPromise = null;
      }
    };

    const jobState: IJobState = {
      jobPromise: null,
      intervalHandle: setInterval(run, intervalMs),
    };

    if (zeroIntervalExec) run();

    return jobState;
  };
}
