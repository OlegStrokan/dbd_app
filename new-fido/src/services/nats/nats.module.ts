import {
  Module,
  Global,
  OnModuleDestroy,
  Inject,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { connect, NatsConnection } from "nats";
import { JetStreamConsumerService } from "./nats-consumer.service";
import { MessageBufferModule } from "../message-buffer/message-buffer.module";

@Global()
@Module({
  imports: [MessageBufferModule],
  providers: [
    {
      provide: "NATS_CONNECTION",
      useFactory: async (): Promise<NatsConnection> => {
        const connection = await connect({ servers: "nats://localhost:4222" });
        return connection;
      },
    },
    {
      provide: "JETSTREAM_CLIENT",
      useFactory: (natsConnection: NatsConnection) => {
        return natsConnection.jetstream();
      },
      inject: ["NATS_CONNECTION"],
    },
    JetStreamConsumerService,
  ],
  exports: ["NATS_CONNECTION", "JETSTREAM_CLIENT", JetStreamConsumerService],
})
export class NatsJetStreamModule implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(NatsJetStreamModule.name);

  constructor(
    @Inject("NATS_CONNECTION") private readonly natsConnection: NatsConnection,
    private readonly jetStreamConsumerService: JetStreamConsumerService
  ) {}

  async onModuleInit() {
    try {
      await this.jetStreamConsumerService.connect(
        "parcel-event-consumer",
        "parcel-ev",
        "parcel-event"
      );
      this.logger.log("Connected to NATS JetStream");
    } catch (error) {
      this.logger.error("Error connecting to NATS JetStream", error);
    }
  }

  async onModuleDestroy() {
    await this.jetStreamConsumerService.onModuleDestroy();
    await this.natsConnection.close();
  }
}
