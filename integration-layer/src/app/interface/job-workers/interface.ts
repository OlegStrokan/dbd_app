import { NatsService } from "../../infrastructure/nats";

export interface IWorker {
  init(natsService: NatsService): Promise<void>;
  startCronJob(): Promise<void>;
}
