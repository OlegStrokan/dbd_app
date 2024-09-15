import { Injectable } from "@nestjs/common";
import { IMessageBufferService } from "./message-buffer-interface";
import { JsMsg } from "nats";

@Injectable()
export class MessageBufferService implements IMessageBufferService {
  private messageBuffers: Map<string, Uint8Array[]> = new Map();
  private bufferLocks: Map<string, boolean> = new Map();

  async addMessage(subjectName: string, msg: Uint8Array): Promise<void> {
    await this.acquireBufferLock(subjectName);
    if (!this.messageBuffers.has(subjectName)) {
      this.messageBuffers.set(subjectName, []);
    }
    this.messageBuffers.get(subjectName)?.push(msg);
    this.releaseBufferLock(subjectName);
  }
  async getMessageBuffer(subjectName: string): Promise<Uint8Array[]> {
    await this.acquireBufferLock(subjectName);
    const buffer: Uint8Array[] = this.messageBuffers.get(subjectName);
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
