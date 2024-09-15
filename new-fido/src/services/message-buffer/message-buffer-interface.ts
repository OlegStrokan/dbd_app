export interface IMessageBufferService {
  addMessage(subjectName: string, msg: Uint8Array): Promise<void>;
  getMessageBuffer(subjectName: string): Promise<Uint8Array[]>;
  clearMessageBuffer(subjectName: string): void;
}
