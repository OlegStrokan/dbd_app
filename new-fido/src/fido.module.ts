import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParcelDeliveryEntity } from "./parcel-delivery/infrastructure/entity/parcel-delivery";
import { ConfigModule, ConfigObject, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ActionLogEntity } from "./services/action-logger/entity";
import { RedisRepository } from "./services/redis/infrastructure/repository";
import { NatsJetStreamModule } from "./services/nats/jetstream.module";
import { AppConfig } from "./shared/tools/configs/app.config";
import { DbConfig } from "./services/database/database.config";
import { ParcelDeliveryModule } from "./parcel-delivery/parcel-delivery.module";
import { ReportModule } from "./report/report.module";
import { ActionLoggerModule } from "./services/action-logger/action-logger.module";
import { RedisModule } from "./services/redis/redis.module";
import { JetStreamConsumerService } from "./services/nats/jetstream";
@Module({
  imports: [
    RedisModule,
    NatsJetStreamModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DbConfig],
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
    ParcelDeliveryModule,
    ReportModule,
    ActionLoggerModule,
    //  AuthService,
    // AuthConfig,
  ],
  providers: [
    {
      provide: RedisRepository,
      useClass: RedisRepository,
    },
    JetStreamConsumerService,
  ],
  exports: [JetStreamConsumerService],
})
export class FidoModule {}
