import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { DecodingDataModule } from "@app/services/decoding-data/decoding-data.module";
import { NatsJetStreamModule } from "@app/services/jet-stream/jet-stream.module";
import { MessageBufferModule } from "@app/services/message-buffer/message-buffer.module";
import { ParcelEventWorker } from "./parcel-event/parcel-event.worker";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DecodingDataModule,
    NatsJetStreamModule,
    MessageBufferModule,
  ],
  providers: [ParcelEventWorker, ParcelDeliveryRepository],
  exports: [],
})
export class WorkerModule {}
