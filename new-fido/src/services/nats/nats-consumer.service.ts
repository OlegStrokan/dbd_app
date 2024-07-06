import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
import {
  NatsConnection,
  JetStreamSubscription,
  StringCodec,
  JsMsg,
  consumerOpts,
} from "nats";
import { IMessageBufferService } from "../message-buffer/interface";

@Injectable()
export class JetStreamConsumerService implements OnModuleDestroy {
  private subscriptions: Map<string, JetStreamSubscription> = new Map();

  constructor(
    @Inject("NATS_CONNECTION") private readonly natsConnection: NatsConnection,
    private readonly messageBufferService: IMessageBufferService // Inject the buffer service
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
      await this.messageBufferService.addMessage(subjectName, msg);

      console.log(
        `Processing message for ${subjectName}: ${msg.subject} ${msg.seq}`
      );
      const sc = StringCodec();
      console.log(`Message content: ${sc.decode(msg.data)}`);

      msg.ack();
    } catch (error) {
      console.error(`Error processing message for ${subjectName}:`, error);
    }
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
}
