import { Injectable } from "@nestjs/common";
import { connect, NatsConnection, JetStreamManager } from "nats";

@Injectable()
export class NatsService {
  private client: NatsConnection;
  private jsm: JetStreamManager;

  async connect() {
    this.client = await connect({ servers: "nats://localhost:4222" });
    this.jsm = await this.client.jetstreamManager();

    console.log("Connected to NATS and JetStream");
  }

  getConnection(): NatsConnection {
    return this.client;
  }

  getJetStreamManager(): JetStreamManager {
    return this.jsm;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }
}
