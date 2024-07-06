// parcel.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParcelDeliveryEntity } from "./infrastructure/entity/parcel-delivery";
import { ParcelDeliveryRepository } from "./infrastructure/repository/parcel-delivery";
import { ParcelDeliveryResolver } from "./resolver/resolver";
import { ParcelImportService } from "./services/parcel-import";
import { CreateParcelDeliveryUseCase } from "./use-cases/create-parcel-delivery";
import { GetParcelDeliveryUseCase } from "./use-cases/get-parcel-delivery";
import { ParcelDeliveryMapper } from "./resolver/mappers";
import { JetStreamConsumerService } from "@app/services/nats/nats-consumer.service";
import { RedisModule } from "@app/services/redis/redis.module";
import { ActionLoggerModule } from "@app/services/action-logger/action-logger.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ParcelDeliveryEntity]),
    RedisModule,
    ActionLoggerModule,
  ],
  providers: [
    ParcelDeliveryRepository,
    ParcelImportService,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryResolver,
    ParcelDeliveryMapper,
    JetStreamConsumerService,
  ],
  exports: [
    ParcelDeliveryRepository,
    ParcelImportService,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryMapper,
  ],
})
export class ParcelDeliveryModule {}
