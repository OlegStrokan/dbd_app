import { connect, JetStreamManager, NatsConnection } from "nats";
import { logger } from "../../core/services/logger";

const server = "nats://localhost:4222";

export const getJetStreamConnection = async (
  subject: string
): Promise<NatsConnection> => {
  const nats = await connect({ servers: server });
  const jsm = await nats.jetstreamManager();
  try {
    await jsm.streams.add({ name: "parcel-event", subjects: [subject] });
    logger.info('Stream "parcel-event" has been created');
  } catch (error) {
    if (error.code !== "STREAM_NAME_EXISTS") {
      throw error;
    }
  }

  return nats;
};
