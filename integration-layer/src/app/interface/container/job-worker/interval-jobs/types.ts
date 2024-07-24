import { IJobWorkerContainer } from "..";

type Milliseconds = number;

export interface IInvervalJob {
  name: string;
  intervalMs: Milliseconds;
  /**
   * Should the job be executed immediately the first time (at interval 0)?
   */
  zeroIntervalExec?: boolean;
  job: (container: IJobWorkerContainer) => void | Promise<void>;
  enabled: boolean;
}

export interface IJobScheduler {
  start(): Promise<unknown>;
  stop(): Promise<unknown>;
}
