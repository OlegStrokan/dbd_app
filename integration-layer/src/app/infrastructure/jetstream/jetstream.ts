import { connect, JetStreamManager, NatsConnection } from "nats";

const server = "nats://10.32.0.18:4222";

export const getJetStreamConnection = async (
  subject: string
): Promise<NatsConnection> => {
  const nats = await connect({ servers: server });
  const jsm = await nats.jetstreamManager();
  try {
    await jsm.streams.add({ name: "parcel-event", subjects: [subject] });
  } catch (error) {
    if (error.code !== "STREAM_NAME_EXISTS") {
      throw error;
    }
  }

  return nats;
};
