import { logger } from "@root/src/app/core/services/logger";
import { IJobWorkerContainer } from "..";
import { IInvervalJob, IJobScheduler } from "./types";

interface IJobState {
  jobPromise: Promise<void> | null;
  intervalHandle: NodeJS.Timer;
}
export class InvervalJobScheduler implements IJobScheduler {
  private jobStates: IJobState[] = [];

  constructor(
    private readonly parentContainer: IJobWorkerContainer,
    private readonly jobs: IInvervalJob[]
  ) {}

  start = async () => {
    if (this.jobStates.length > 0) return;

    this.jobStates = await Promise.all(
      this.jobs.filter((j) => j.enabled).map(this.scheduleInterfaceJob)
    );
  };

  stop = async () => {
    this.jobStates.forEach(({ intervalHandle }) =>
      clearInterval(intervalHandle)
    );
  };

  private scheduleInterfaceJob = async ({
    name,
    intervalMs,
    zeroIntervalExec,
    job,
  }: IInvervalJob): Promise<IJobState> => {
    const run = async () => {
      const jobPromise = Promise.resolve(job(this.parentContainer));

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
