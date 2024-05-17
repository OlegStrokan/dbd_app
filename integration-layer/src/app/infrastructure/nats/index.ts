import { connect, NatsConnection, Subscription, JSONCodec } from "nats";

export class NatsService {
  private connection: NatsConnection | null = null;
  private subscription: Subscription | null = null;

  constructor() {}

  async connect(url: string): Promise<void> {
    this.connection = await connect({ servers: url });
  }

  async subscribe(subject: string): Promise<void> {
    if (!this.connection) {
      throw new Error(
        "Must connect to NATS server before subscribing to a subject"
      );
    }
    this.subscription = this.connection.subscribe(subject);
  }

  async disconnect(): Promise<void> {
    await this.subscription?.drain();
    await this.connection?.close();
  }

  get getConnection(): NatsConnection | null {
    return this.connection;
  }
}
