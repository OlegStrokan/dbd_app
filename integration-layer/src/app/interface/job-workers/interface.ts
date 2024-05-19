import { NatsConnection } from "nats";

export interface IWorker {
  init(connection: NatsConnection): Promise<void>;
  startCronJob(): Promise<void>;
}
