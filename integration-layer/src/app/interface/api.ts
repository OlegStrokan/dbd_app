import Fastify, { FastifyServerOptions } from "fastify";

export const createIntegrationApiInterface = async (
  serverOptions: FastifyServerOptions
) => {
  const app = Fastify(serverOptions);

  app.get("/health", async () => {
    return { status: "ok" };
  });

  return app;
};
