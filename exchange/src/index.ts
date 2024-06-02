import { createApp } from "./app";
import "reflect-metadata";
import * as dotenv from "dotenv";

dotenv.config({ path: "./env" });

const start = async () => {
  const app = await createApp({ logger: true });

  try {
    await app.listen(3002);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
