import { JsMsg } from "nats";

export interface IJetStreamService {
  connect(
    consumerName: string,
    streamName: string,
    subjectName: string
  ): Promise<void>;
  subscribe(
    consumerName: string,
    streamName: string,
    subjectName: string
  ): Promise<void>;
  processMessage(subjectName: string, msg: JsMsg): Promise<void>;
  onModuleDestroy(): Promise<void>;
}
