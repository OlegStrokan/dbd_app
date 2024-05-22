import { Injectable, OnModuleInit } from "@nestjs/common";
import { NatsService } from "../nats";

@Injectable()
export class NatsStreamService implements OnModuleInit {
  private readonly subjects = ["parcel-event"];

  constructor(private readonly natsService: NatsService) {}

  async onModuleInit() {
    await this.subscribeToNats();
  }

  private async subscribeToNats() {
    try {
      await this.natsService.connect();
      const nats = this.natsService.getConnection;
      for (const subject of this.subjects) {
        nats.subscribe(subject);
      }
    } catch (error) {
      console.error("Error consuming NATS messages:", error);
    }
  }
}
