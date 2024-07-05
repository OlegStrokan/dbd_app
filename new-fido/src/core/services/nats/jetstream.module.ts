// nats-jetstream.module.ts
import { Module, Global, OnModuleDestroy, Inject } from "@nestjs/common";
import { connect, NatsConnection, JetStreamManager } from "nats";

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
      provide: "JETSTREAM_MANAGER",
      useFactory: async (
        natsConnection: NatsConnection
      ): Promise<JetStreamManager> => {
        const manager = await natsConnection.jetstreamManager();
        return manager;
      },
      inject: ["NATS_CONNECTION"],
    },
    {
      provide: "JETSTREAM_CLIENT",
      useFactory: (natsConnection: NatsConnection) => {
        return natsConnection.jetstream();
      },
      inject: ["NATS_CONNECTION"],
    },
  ],
  exports: ["NATS_CONNECTION", "JETSTREAM_MANAGER", "JETSTREAM_CLIENT"],
})
export class NatsJetStreamModule implements OnModuleDestroy {
  constructor(
    @Inject("NATS_CONNECTION") private readonly natsConnection: NatsConnection
  ) {}

  async onModuleDestroy() {
    await this.natsConnection.close();
  }
}
