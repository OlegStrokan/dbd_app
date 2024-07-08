import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParcelDeliveryEntity } from "./parcel-delivery/infrastructure/entity/parcel-delivery";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ActionLogEntity } from "./services/action-logger/entity";
import { RedisRepository } from "./services/redis/infrastructure/repository";
import { NatsJetStreamModule } from "./services/jet-stream/jet-stream.module";
import { AppConfig } from "./shared/tools/configs/app.config";
import { DbConfig } from "./services/database/database.config";
import { ParcelDeliveryModule } from "./parcel-delivery/parcel-delivery.module";
import { ReportModule } from "./report/report.module";
import { ActionLoggerModule } from "./services/action-logger/action-logger.module";
import { RedisModule } from "./services/redis/redis.module";
import { DecodingDataModule } from "./services/decoding-data/decoding-data.module";
import { MessageBufferModule } from "./services/message-buffer/message-buffer.module";
@Module({
  imports: [
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
    TypeOrmModule.forFeature([ParcelDeliveryEntity, ActionLogEntity]),
    RedisModule,
    NatsJetStreamModule,
    DecodingDataModule,
    MessageBufferModule,
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
  ],
  exports: [],
})
export class FidoModule {}
