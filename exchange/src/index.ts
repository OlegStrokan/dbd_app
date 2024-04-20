import { createIntegrationApiInterface } from "./app";

const serverOptions = { logger: true };

const startServer = async () => {
  const app = await createIntegrationApiInterface(serverOptions);

  app.listen(3000, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
};

startServer();
