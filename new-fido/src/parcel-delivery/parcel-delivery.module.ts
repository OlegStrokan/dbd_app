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

@Module({
  imports: [
    TypeOrmModule.forFeature([ParcelDeliveryEntity]),
    RedisModule,
    ActionLoggerModule,
  ],
  providers: [
    ParcelDeliveryRepository,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryResolver,
    ParcelDeliveryMapper,
    JetStreamService,
  ],
  exports: [
    ParcelDeliveryRepository,
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryMapper,
  ],
})
export class ParcelDeliveryModule {}
