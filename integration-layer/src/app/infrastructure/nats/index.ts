import {
  connect,
  NatsConnection,
  Subscription,
  AckPolicy,
  consumerOpts,
  JetStreamManager,
  JetStreamClient,
} from "nats";
import { logger } from "../../core/services/logger";

export class NatsService {
  private connection: NatsConnection | null = null;
  private subscription: Subscription | null = null;
  private jetStreamManager: JetStreamManager | null = null;

  constructor() {}

  async connect(url: string): Promise<void> {
    this.connection = await connect({ servers: url });
    this.jetStreamManager = await this.connection.jetstreamManager();
    logger.info("Successfully connected to url", url);
  }

  async addJetStream(
    subjects: string[],
    name: string = "EVENTS"
  ): Promise<void> {
    await this.jetStreamManager.streams.add({ subjects, name });
    logger.info("Successfully added stream", subjects);
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

  get getJetStream(): JetStreamClient | null {
    return this.connection.jetstream();
  }
}
