import { connect, JetStreamManager, NatsConnection } from "nats";

const server = "nats://localhost:4222";

export const getJetStreamConnection = async (): Promise<NatsConnection> => {
  const nats = await connect({ servers: server });
  const jsm = await nats.jetstreamManager();
  try {
    await jsm.streams.add({ name: "parcel-event", subjects: ["parcel-event"] });
  } catch (error) {
    if (error.code !== "STREAM_NAME_EXISTS") {
      throw error;
    }
  }

  return nats;
};
