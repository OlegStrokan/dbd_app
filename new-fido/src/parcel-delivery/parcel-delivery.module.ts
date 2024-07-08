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
import { SUBJECTS } from "@app/services/jet-stream/subjects";
import { MessageBufferModule } from "@app/services/message-buffer/message-buffer.module";
import { ScheduleModule, CronExpression } from "@nestjs/schedule";

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
    ParcelDeliveryRepository,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryResolver,
    ParcelDeliveryMapper,
    JetStreamService,
    { provide: "SUBJECTS", useValue: SUBJECTS.PARCEL_EVENT },
    { provide: "CRON_RULE", useValue: CronExpression.EVERY_MINUTE },
  ],
  exports: [
    ParcelDeliveryRepository,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryMapper,
  ],
})
export class ParcelDeliveryModule {}
