import { Injectable, Module } from "@nestjs/common";
import { BufferToDbService } from "./buffer-to-db.service";
import { JetStreamService } from "../jet-stream/jet-stream.service";
import { MessageBufferService } from "../message-buffer/message-buffer.service";
import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { DecodingDataService } from "@app/services/decoding-data/decoding-data.service";
import { CronExpression } from "@nestjs/schedule";
import { SUBJECTS } from "@app/services/jet-stream/subjects";
import { CreateParcelDeliveryDto } from "@app/parcel-delivery/use-cases/create-parcel-delivery/dto/create-parcel-delivery.dto";
import { NatsJetStreamModule } from "../jet-stream/jet-stream.module";
import { MessageBufferModule } from "../message-buffer/message-buffer.module";
import { DecodingDataModule } from "../decoding-data/decoding-data.module";

@Module({
  imports: [NatsJetStreamModule, MessageBufferModule, DecodingDataModule],
  providers: [BufferToDbService],
  exports: [BufferToDbService],
})
export class BufferToDbModule {}
