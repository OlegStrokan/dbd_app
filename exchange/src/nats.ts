import { connect, NatsConnection, Subscription, JSONCodec } from "nats";

class NatsService {
  private connection: NatsConnection | null = null;
  private subscription: Subscription | null = null;
  private jc = JSONCodec();

  constructor() {}

  async connect(url: string, subject: string): Promise<void> {
    this.connection = await connect({ servers: url });
    this.subscription = this.connection.subscribe(subject);

    (async () => {
      for await (const m of this.subscription) {
        const data = this.jc.decode(m.data);
      }
    })().catch((err) => {
      console.error(err);
    });
  }

  async disconnect(): Promise<void> {
    await this.subscription?.drain();
    await this.connection?.close();
  }

  get getConnection(): NatsConnection | null {
    return this.connection;
  }
}

export default NatsService;
