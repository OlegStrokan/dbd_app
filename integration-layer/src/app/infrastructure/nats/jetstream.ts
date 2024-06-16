import { AckPolicy, connect, consumerOpts } from "nats";

const server = "http://localhost:4222";

export const getJetStreamConnection = async () => {
  const nats = await connect({ servers: server });

  const jsm = await nats.jetstreamManager();

  await jsm.streams.add({ name: "parcel-event", subjects: ["parcel-event"] });
  return nats;
};
