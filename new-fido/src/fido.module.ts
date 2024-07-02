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
// import { AuthService } from './core/services/authorization';
// import { AuthConfig } from './infrastructure/common/config/auth.config';
import { ParcelDeliveryResolver } from "./interfaces/parcel-delivery/resolver";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NatsService } from "./core/services/nats";
import Redis from "ioredis";
import { JetStreamConsumerService } from "./core/services/nats/jetstream";
import { ParcelDeliveryMapper } from "./interfaces/parcel-delivery/mappers";
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
  ],
  providers: [
    CreateParcelDeliveryUseCase,
    GetParcelDeliveryUseCase,
    ParcelDeliveryResolver,
    ParcelImportService,
    NatsService,
    ActionLoggerService,
    //  AuthService,
    // AuthConfig,
    ParcelDeliveryRepository,
    ActionLogRepository,
    ParcelDeliveryRepository,
    // TODO update it with redis factory class
    RedisService,
    JetStreamConsumerService,
    ParcelDeliveryMapper,
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
