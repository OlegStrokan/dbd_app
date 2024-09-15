// parcel.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParcelDeliveryEntity } from "./infrastructure/entity/parcel-delivery";
import { ParcelDeliveryRepository } from "./infrastructure/repository/parcel-delivery";
import { ParcelDeliveryResolver } from "./resolver/resolver";
import { CreateParcelDeliveryUseCase } from "./use-cases/create-parcel-delivery";
import { GetParcelDeliveryUseCase } from "./use-cases/get-parcel-delivery";
import { ParcelDeliveryMapper } from "./resolver/mappers";
import { JetStreamService } from "@app/services/jet-stream/jet-stream.service";
import { RedisModule } from "@app/services/redis/redis.module";
import { ActionLoggerModule } from "@app/services/action-logger/action-logger.module";
import { DecodingDataModule } from "@app/services/decoding-data/decoding-data.module";
import { NatsJetStreamModule } from "@app/services/jet-stream/jet-stream.module";
import { MessageBufferModule } from "@app/services/message-buffer/message-buffer.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ParcelEventWorker } from "./workers/parcel-event.worker";
import { ParcelEventMocksService } from "./workers/mocks/parcel-event.mocks";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ParcelDeliveryEntity]),
    RedisModule,
    ActionLoggerModule,
    DecodingDataModule,
    NatsJetStreamModule,
    MessageBufferModule,
  ],
  providers: [
    ParcelEventMocksService,
    ParcelDeliveryRepository,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryResolver,
    ParcelEventWorker,
    ParcelDeliveryMapper,
    JetStreamService,
    ParcelEventWorker,
  ],
  exports: [
    ParcelEventMocksService,
    ParcelDeliveryRepository,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryMapper,
    ParcelEventWorker,
  ],
})
export class ParcelDeliveryModule {}
