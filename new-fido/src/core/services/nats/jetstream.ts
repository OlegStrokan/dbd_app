import { Injectable, OnModuleDestroy } from "@nestjs/common";
import {
  connect,
  consumerOpts,
  NatsConnection,
  JsMsg,
  JetStreamSubscription,
  StringCodec,
} from "nats";

@Injectable()
export class JetStreamConsumerService implements OnModuleDestroy {
  private nats: NatsConnection;
  private subscription: JetStreamSubscription;
  private server = "nats://localhost:4222";
  private messageBuffer: JsMsg[] = [];
  private bufferLock: boolean = false;

  async connect(consumerName: string, streamName: string, subjectName: string) {
    try {
      this.nats = await connect({ servers: this.server });
      await this.subscribe(consumerName, streamName, subjectName);
    } catch (error) {
      console.error("Error connecting to NATS:", error);
      throw error;
    }
  }

  private async subscribe(
    consumerName: string,
    streamName: string,
    subjectName: string
  ) {
    try {
      const jetStream = this.nats.jetstream();
      const opts = consumerOpts();
      opts.durable(consumerName);
      opts.manualAck();
      opts.ackExplicit();
      opts.deliverTo(`${streamName}-subscription`);
      opts.ackWait(60 * 1000);

      this.subscription = await jetStream.subscribe(subjectName, opts);

      for await (const msg of this.subscription) {
        await this.processMessage(msg);
      }
    } catch (error) {
      console.error("Error subscribing to NATS messages:", error);
      throw error;
    }
  }

  private async processMessage(msg: JsMsg) {
    try {
      await this.acquireBufferLock();
      this.messageBuffer.push(msg);
      this.releaseBufferLock();

      // Simulate message processing
      console.log(`Processing message: ${msg.subject} ${msg.seq}`);
      const sc = StringCodec();
      console.log(`Message content: ${sc.decode(msg.data)}`);

      // Acknowledge the message after processing
      msg.ack();
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  async getMessageBuffer(): Promise<JsMsg[]> {
    await this.acquireBufferLock();
    const currentBuffer = [...this.messageBuffer];
    this.releaseBufferLock();
    return currentBuffer;
  }

  clearMessageBuffer(): void {
    this.messageBuffer = []; // Clear the buffer
  }

  private async acquireBufferLock() {
    while (this.bufferLock) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait until lock is released
    }
    this.bufferLock = true; // Acquire the lock
  }

  private releaseBufferLock() {
    this.bufferLock = false; // Release the lock
  }

  async onModuleDestroy() {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        console.log("Unsubscribed from NATS messages");
      }
      if (this.nats) {
        await this.nats.close();
        console.log("NATS connection closed on module destroy.");
      }
    } catch (error) {
      console.error("Error disconnecting from NATS:", error);
    }
  }
}
