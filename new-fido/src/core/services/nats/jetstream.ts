import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { connect, consumerOpts, AckPolicy, NatsConnection, JsMsg } from "nats";

@Injectable()
export class JetStreamConsumerService implements OnModuleDestroy {
  private nats: NatsConnection;
  private subscription: any;
  private server = "nats://localhost:4222";

  async connect(consumerName: string, streamName: string, subjectName: string) {
    this.nats = await connect({ servers: this.server });
    await this.subscribe(consumerName, streamName, subjectName);
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

      (async () => {
        for await (const msg of this.subscription) {
          await this.handleMessage(msg);
        }
      })()
        .then(() => {
          console.log("Subscription closed");
        })
        .catch((error) => {
          console.error("Error in subscription:", { error });
        });

      console.log(
        `Subscribed to NATS messages with JetStream on subject ${subjectName}`
      );
    } catch (error) {
      console.error("Error subscribing to NATS messages:", error);
    }
  }

  private async handleMessage(msg: JsMsg) {
    try {
      const data = msg.data.toString();
      console.log("Received parcel event:", { data });

      msg.ack();
    } catch (error) {
      console.error("Error processing message:", { error });
    }
  }

  async onModuleDestroy() {
    if (this.subscription) {
      try {
        await this.subscription.unsubscribe();
        console.log("Unsubscribed from NATS messages");
      } catch (error) {
        console.error("Error unsubscribing from NATS messages:", error);
      }
    }
    if (this.nats) {
      try {
        await this.nats.close();
        console.log("NATS connection closed on module destroy.");
      } catch (error) {
        console.error("Error disconnecting from NATS:", error);
      }
    }
  }
}
