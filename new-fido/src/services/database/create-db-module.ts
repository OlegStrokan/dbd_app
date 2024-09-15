import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { ParcelDeliveryEntity } from "../../parcel-delivery/infrastructure/entity/parcel-delivery";
import { CreateParcelDeliveryUseCase } from "../../parcel-delivery/use-cases/create-parcel-delivery";
import { ParcelDeliveryRepository } from "../../parcel-delivery/infrastructure/repository/parcel-delivery";
import { ScheduleModule } from "@nestjs/schedule";
import { GetParcelDeliveryUseCase } from "../../parcel-delivery/use-cases/get-parcel-delivery";
import { ActionLogRepository } from "../action-logger/infractructure/repository";
import { ActionLogEntity } from "../action-logger/entity";
import { RedisRepository } from "../redis/infrastructure/repository";
import { redisClientFactory } from "../redis/index.factory";
// import {AuthService} from "../../../core/services/authorization";
// import { AuthConfig } from '../config/auth.config';
import { ActionLoggerService } from "../action-logger/services";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppConfig } from "@app/shared/tools/configs/app.config";
import { DbConfig } from "./database.config";
import { RedisModule } from "../redis/redis.module";
import { ParcelDeliveryModule } from "@app/parcel-delivery/parcel-delivery.module";
import { ReportModule } from "@app/report/report.module";
import { ActionLoggerModule } from "../action-logger/action-logger.module";
import { DecodingDataModule } from "../decoding-data/decoding-data.module";
import { NatsJetStreamModule } from "../jet-stream/jet-stream.module";
import { MessageBufferModule } from "../message-buffer/message-buffer.module";

export const createDbTestingModule = async () => {
  return await Test.createTestingModule({
    imports: [
      ScheduleModule.forRoot(),
      ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        load: [AppConfig, DbConfig],
        envFilePath: `.env`,
      }),
      TypeOrmModule.forRoot({
        type: "postgres",
        host: "10.32.0.18",
        port: 8433,
        username: "stroka01",
        password: "user",
        database: "test_db",
        entities: [ParcelDeliveryEntity, ActionLogEntity],
        synchronize: true,
        migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
        migrationsTableName: "migrations",
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
      // AuthConfig,s
    ],
    providers: [
      {
        provide: RedisRepository,
        useClass: RedisRepository,
      },
    ],
    exports: [],
  }).compile();
};
