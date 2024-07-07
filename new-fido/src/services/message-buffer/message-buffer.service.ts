import { Injectable } from "@nestjs/common";
import { IMessageBufferService } from "./message-buffer-interface";
import { JsMsg } from "nats";

@Injectable()
export class MessageBufferService implements IMessageBufferService {
  private messageBuffers: Map<string, JsMsg[]> = new Map();
  private bufferLocks: Map<string, boolean> = new Map();

  async addMessage(subjectName: string, msg: JsMsg): Promise<void> {
    await this.acquireBufferLock(subjectName);
    if (!this.messageBuffers.has(subjectName)) {
      this.messageBuffers.set(subjectName, []);
    }
    this.messageBuffers.get(subjectName)?.push(msg);
    this.releaseBufferLock(subjectName);
  }
  async getMessageBuffer(subjectName: string): Promise<JsMsg[]> {
    await this.acquireBufferLock(subjectName);
    const buffer: JsMsg[] = this.messageBuffers.get(subjectName);
    this.releaseBufferLock(subjectName);
    return buffer;
  }
  clearMessageBuffer(subjectName: string): void {
    this.messageBuffers.set(subjectName, []);
  }

  private async acquireBufferLock(subjectName: string) {
    while (this.bufferLocks.get(subjectName)) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    this.bufferLocks.set(subjectName, true);
  }

  private releaseBufferLock(subjectName: string) {
    this.bufferLocks.set(subjectName, false);
  }
}
