import Fastify, { FastifyServerOptions } from "fastify";
import { JSONCodec } from "nats";
import NatsService from "./app/core/services/nats";
import { createIntegrationApiInterface } from "./app/interface/api";

const validateMessage = (message: any) => {
  return message.parcelNumber % 2 === 0;
};

const createResponse = (message: any) => {
  return { status: "success", message };
};

const startServer = async () => {
  const serverOptions = { logger: true };
  const app = await createIntegrationApiInterface(serverOptions);

  const natsService = new NatsService();
  await natsService.connect("nats://localhost:4222", "parcel-event");

  const nc = natsService.getConnection;

  const sub = nc.subscribe("parcel-event");
  for await (const m of sub) {
    const message = JSONCodec().decode(m.data);
    console.log(`Received a message: ${m.subject} ${m.data}`);
    const isValid = validateMessage(message);
    if (isValid) {
      console.log("Message is valid", message);
      const responseMessage = createResponse(message);
      nc.publish("fido-parcel", JSONCodec().encode(responseMessage));
    }
  }

  app.listen(3000, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

startServer();
