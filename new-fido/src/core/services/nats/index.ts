import { connect, NatsConnection, Subscription } from "nats";

export class NatsService {
  private connection: NatsConnection | null = null;
  private subscription: Subscription | null = null;

  constructor() {}

  async connect(url: string, subject: string): Promise<void> {
    this.connection = await connect({ servers: url });
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
