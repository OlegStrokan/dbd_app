// jetstream-consumer.service.ts
import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import {
  NatsConnection,
  JetStreamSubscription,
  JetStreamManager,
  StringCodec,
  JsMsg,
  consumerOpts,
} from "nats";

@Injectable()
export class JetStreamConsumerService implements OnModuleDestroy {
  private subscriptions: Map<string, JetStreamSubscription> = new Map(); // Map to store subscriptions
  private messageBuffers: Map<string, JsMsg[]> = new Map(); // Map to store message buffers per subscription
  private bufferLocks: Map<string, boolean> = new Map(); // Map to store buffer locks per subscription

  constructor(
    @Inject("NATS_CONNECTION") private readonly natsConnection: NatsConnection,
    @Inject("JETSTREAM_MANAGER")
    private readonly jetStreamManager: JetStreamManager
  ) {}

  async connect(consumerName: string, streamName: string, subjectName: string) {
    try {
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
      const jetStream = this.natsConnection.jetstream();
      const opts = consumerOpts();
      opts.durable(consumerName);
      opts.manualAck();
      opts.ackExplicit();
      opts.deliverTo(`${streamName}-subscription`);
      opts.ackWait(60 * 1000);

      const subscription = await jetStream.subscribe(subjectName, opts);
      this.subscriptions.set(subjectName, subscription);
      this.messageBuffers.set(subjectName, []);
      this.bufferLocks.set(subjectName, false);

      for await (const msg of subscription) {
        await this.processMessage(subjectName, msg);
      }
    } catch (error) {
      console.error(
        `Error subscribing to NATS messages for ${subjectName}:`,
        error
      );
      throw error;
    }
  }

  private async processMessage(subjectName: string, msg: JsMsg) {
    try {
      await this.acquireBufferLock(subjectName);
      this.messageBuffers.get(subjectName)?.push(msg);
      this.releaseBufferLock(subjectName);

      // Simulate message processing
      console.log(
        `Processing message for ${subjectName}: ${msg.subject} ${msg.seq}`
      );
      const sc = StringCodec();
      console.log(`Message content: ${sc.decode(msg.data)}`);

      // Acknowledge the message after processing
      msg.ack();
    } catch (error) {
      console.error(`Error processing message for ${subjectName}:`, error);
    }
  }

  async getMessageBuffer(subjectName: string): Promise<JsMsg[]> {
    await this.acquireBufferLock(subjectName);
    const currentBuffer = [...(this.messageBuffers.get(subjectName) || [])];
    this.releaseBufferLock(subjectName);
    return currentBuffer;
  }

  clearMessageBuffer(subjectName: string): void {
    this.messageBuffers.set(subjectName, []); // Clear the buffer for the specified subject
  }

  private async acquireBufferLock(subjectName: string) {
    while (this.bufferLocks.get(subjectName)) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait until lock is released
    }
    this.bufferLocks.set(subjectName, true); // Acquire the lock for the specified subject
  }

  private releaseBufferLock(subjectName: string) {
    this.bufferLocks.set(subjectName, false); // Release the lock for the specified subject
  }

  async onModuleDestroy() {
    try {
      for (const [subjectName, subscription] of this.subscriptions) {
        await subscription.unsubscribe();
        console.log(`Unsubscribed from NATS messages for ${subjectName}`);
      }
    } catch (error) {
      console.error("Error disconnecting from NATS:", error);
    }
  }

  async publish(subjectName: string, data: Uint8Array) {
    try {
      const jetStream = this.natsConnection.jetstream();
      const sc = StringCodec();
      const payload = sc.encode(data.toString());
      await jetStream.publish(subjectName, payload);
      console.log(`Message published to ${subjectName}`);
    } catch (error) {
      console.error("Error publishing message to NATS:", error);
    }
  }
}
