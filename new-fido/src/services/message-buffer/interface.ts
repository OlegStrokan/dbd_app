import { JsMsg } from "nats";

export interface IMessageBufferService {
  addMessage(subjectName: string, msg: JsMsg): Promise<void>;
  getMessageBuffer(subjectName: string): Promise<JsMsg[]>;
  clearMessageBuffer(subjectName: string): void;
}
