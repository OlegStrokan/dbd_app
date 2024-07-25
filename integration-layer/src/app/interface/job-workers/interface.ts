export interface IScheduleJob {
  startCronJob(): Promise<void>;
}
