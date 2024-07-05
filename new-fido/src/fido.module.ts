import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateParcelDeliveryUseCase } from "./core/use-cases/create-parcel-delivery";
import { ParcelDeliveryEntity } from "./infrastructure/entities/parcel-delivery";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfig, DatabaseConfig } from "./infrastructure/common/config";
import { ParcelDeliveryRepository } from "./infrastructure/repositories/parcel-delivery";
import { ParcelImportService } from "./core/services/parcel-import";
import { ScheduleModule } from "@nestjs/schedule";
import { ActionLoggerService } from "./core/services/action-logger";
import { ActionLogEntity } from "./infrastructure/entities/action-logger";
import { ActionLogRepository } from "./infrastructure/repositories/action-logger";
import { RedisRepository } from "./infrastructure/repositories/redis";
import { GetParcelDeliveryUseCase } from "./core/use-cases/get-parcel-delivery";
import { RedisService } from "./core/services/redis";
import { ParcelDeliveryResolver } from "./interfaces/parcel-delivery/resolver";
import Redis from "ioredis";
import { JetStreamConsumerService } from "./core/services/nats/jetstream";
import { ParcelDeliveryMapper } from "./interfaces/parcel-delivery/mappers";
import { NatsJetStreamModule } from "./core/services/nats/jetstream.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ParcelDeliveryEntity, ActionLogEntity]),
    NatsJetStreamModule,
  ],
  providers: [
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryResolver,
    ParcelImportService,
    ActionLoggerService,
    //  AuthService,
    // AuthConfig,
    ParcelDeliveryRepository,
    ActionLogRepository,
    ParcelDeliveryRepository,
    // TODO update it with redis factory class
    RedisService,
    ParcelDeliveryMapper,
    JetStreamConsumerService,
    {
      provide: "RedisClient",
      useFactory: () => {
        return new Redis({
          port: 6379,
          host: "localhost",
          password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81",
        });
      },
    },
    {
      provide: RedisRepository,
      useClass: RedisRepository,
    },
  ],
})
export class FidoModule {}
