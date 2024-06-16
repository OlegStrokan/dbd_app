import { connect, consumerOpts, AckPolicy, NatsConnection } from "nats";

const server = "nats://localhost:4222";

export const createJetStreamConsumer = async () => {
  try {
    const nats = await connect({ servers: server });

    const jetStream = nats.jetstream();

    const opts = consumerOpts();
    opts.durable("parcel-event-consumer");
    opts.manualAck();
    opts.ackExplicit();
    opts.deliverTo("parcel-event-subscription");
    opts.ackWait(60 * 1000); // Wait for up to 60 seconds for ack

    const subscription = await jetStream.subscribe("parcel-event", opts);

    (async () => {
      for await (const msg of subscription) {
        try {
          const data = msg.data.toString(); // Process your message data here
          console.log("Received parcel event:", { data });

          // Process the message
          msg.ack();
        } catch (error) {
          console.error("Error processing message:", { error });
          // Optionally, do not ack to retry later
        }
      }
    })()
      .then(() => {
        console.log("Subscription closed");
      })
      .catch((error) => {
        console.error("Error in subscription:", { error });
      });

    return subscription;
  } catch (error) {
    console.error("Error creating JetStream consumer:", { error });
    throw error;
  }
};
