import {
  Module,
  Global,
  OnModuleDestroy,
  Inject,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { connect, NatsConnection } from "nats";
import { JetStreamService } from "./jet-stream.service";
import { MessageBufferModule } from "../message-buffer/message-buffer.module";
import { IMessageBufferService } from "../message-buffer/message-buffer-interface";
import { IJetStreamService } from "./jet-stream.interface";

@Global()
@Module({
  imports: [MessageBufferModule],
  providers: [
    {
      provide: "NATS_CONNECTION",
      useFactory: async (): Promise<NatsConnection> => {
        const connection = await connect({ servers: "nats://locahost:4222" });
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
    JetStreamService,
  ],
  exports: ["NATS_CONNECTION", "JETSTREAM_CLIENT", JetStreamService],
})
export class NatsJetStreamModule implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(NatsJetStreamModule.name);

  constructor(
    @Inject("NATS_CONNECTION") private readonly natsConnection: NatsConnection,
    private readonly jetStreamConsumerService: JetStreamService
  ) {}

  async onModuleInit() {
    try {
      await this.jetStreamConsumerService.connect(
        "parcel-event-consumer",
        "parcel-event",
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
