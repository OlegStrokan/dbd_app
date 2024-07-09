export interface IWorker {
  startCronJob(): Promise<void>;
}
