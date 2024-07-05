import { Test } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { ParcelDeliveryEntity } from "../../parcel-delivery/infrastructure/entity/parcel-delivery";
import { CreateParcelDeliveryUseCase } from "../../parcel-delivery/use-cases/create-parcel-delivery";
import { ParcelDeliveryRepository } from "../../parcel-delivery/infrastructure/repository/parcel-delivery";
import { ParcelImportService } from "../../parcel-delivery/services/parcel-import";
import { ScheduleModule } from "@nestjs/schedule";
import { GetParcelDeliveryUseCase } from "../../parcel-delivery/use-cases/get-parcel-delivery";
import { ActionLogRepository } from "../action-logger/infractructure/repository";
import { ActionLogEntity } from "../action-logger/entity";
import { RedisRepository } from "../redis/infrastructure/repository";
import { redisClientFactory } from "../redis/index.factory";
// import {AuthService} from "../../../core/services/authorization";
// import { AuthConfig } from '../config/auth.config';
import { ActionLoggerService } from "../action-logger/services";
import { ConfigModule } from "@nestjs/config";
import { AppConfig } from "@app/shared/tools/configs/app.config";
import { DbConfig } from "./database.config";
import { RedisModule } from "../redis/redis.module";

export const createDbTestingModule = async () => {
  return await Test.createTestingModule({
    imports: [
      RedisModule,
      TypeOrmModule.forRoot({
        type: "postgres",
        host: "localhost",
        port: 8433,
        username: "stroka01",
        password: "user",
        database: "test_db",
        entities: [ParcelDeliveryEntity, ActionLogEntity],
        synchronize: true,
        migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
        migrationsTableName: "migrations",
      }),
      TypeOrmModule.forFeature([
        ParcelDeliveryEntity,
        ActionLogEntity,
        ParcelDeliveryRepository,
        ActionLogRepository,
        RedisRepository,
      ]),
      ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        load: [AppConfig, DbConfig],
        envFilePath: `.env`,
      }),
      ScheduleModule.forRoot(),
    ],
    providers: [
      {
        provide: getRepositoryToken(ParcelDeliveryRepository),
        useClass: ParcelDeliveryRepository,
      },
      {
        provide: getRepositoryToken(ActionLogRepository),
        useClass: ActionLogRepository,
      },
      {
        provide: getRepositoryToken(RedisRepository),
        useClass: RedisRepository,
      },
      //  AuthConfig,
      // AuthService,
      ParcelImportService,
      ActionLoggerService,
      CreateParcelDeliveryUseCase,
      GetParcelDeliveryUseCase,
      RedisRepository,
      ParcelDeliveryRepository,
      ActionLogRepository,
      redisClientFactory,
    ],
  }).compile();
};
