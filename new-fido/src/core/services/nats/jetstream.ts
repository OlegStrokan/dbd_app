import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { connect, consumerOpts, NatsConnection, JsMsg } from "nats";

@Injectable()
export class JetStreamConsumerService implements OnModuleDestroy {
  private nats: NatsConnection;
  private subscription: any;
  private server = "nats://localhost:4222";
  private messageBuffer: JsMsg[] = [];

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
        this.messageBuffer.push(msg); // Push received message to buffer
      }
    } catch (error) {
      console.error("Error subscribing to NATS messages:", error);
      throw error; // Propagate the error for handling in the caller (ParcelImportService or other)
    }
  }

  getMessageBuffer(): JsMsg[] {
    return this.messageBuffer;
  }

  clearMessageBuffer(): void {
    this.messageBuffer = [];
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
