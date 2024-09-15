export interface IWorker {
  consumeNatsMessages(): Promise<void>;
}
