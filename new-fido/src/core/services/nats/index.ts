import { connect, NatsConnection, Subscription } from "nats";

export class NatsService {
  private connection: NatsConnection | null = null;
  private subscription: Subscription | null = null;

  constructor() {}

  async connect(): Promise<void> {
    this.connection = await connect({ servers: "nats://localhost:4222" });
  }

  async disconnect(): Promise<void> {
    await this.subscription?.drain();
    await this.connection?.close();
  }

  get getConnection(): NatsConnection | null {
    return this.connection;
  }
}
