// nats-jetstream.module.ts
import {
  Module,
  Global,
  OnModuleDestroy,
  Inject,
  OnModuleInit,
} from "@nestjs/common";
import { connect, NatsConnection } from "nats";
import { JetStreamConsumerService } from "./jetstream";

@Global()
@Module({
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
    JetStreamConsumerService, // Add the service to providers
  ],
  exports: ["NATS_CONNECTION", "JETSTREAM_CLIENT", JetStreamConsumerService], // Export the service
})
export class NatsJetStreamModule implements OnModuleDestroy, OnModuleInit {
  constructor(
    @Inject("NATS_CONNECTION") private readonly natsConnection: NatsConnection,
    private readonly jetStreamConsumerService: JetStreamConsumerService // Inject the service
  ) {}

  async onModuleInit() {
    // TODO - add initialization report worker
    // Connect the consumer service when the module is initialized
    //  await this.jetStreamConsumerService.connect(
    //   "report-worker",
    //   "reports",
    //   "report.requests"
    // );
  }

  async onModuleDestroy() {
    await this.natsConnection.close();
  }
}
