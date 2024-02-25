import {Test} from "@nestjs/testing";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {ParcelDeliveryEntity} from "../../entities/parcel-delivery";
import {CreateParcelDeliveryUseCase} from "../../../core/use-cases/create-parcel-delivery";
import {ParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {ImportDataService} from "../../../core/services/import-manager";
import {ScheduleModule} from "@nestjs/schedule";
import {GetParcelDeliveryUseCase} from "../../../core/use-cases/get-parcel-delivery";
import {ActionLogRepository} from "../../repositories/action-logger";
import {ActionLogEntity} from "../../entities/action-logger";
import {RedisService} from "../../../core/services/redis";
import {RedisRepository} from "../../repositories/redis";
import {redisClientFactory} from "../redis/index.factory";
import {AuthService} from "../../../core/services/authorization";
import {AuthConfig} from "../config/auth.config";
import {ActionLoggerService} from "../../../core/services/action-logger";
import {ConfigModule} from "@nestjs/config";
import {AppConfig, DatabaseConfig} from "../config";

export const createDbTestingModule = async () => {
    return await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 8433,
                username: 'stroka01',
                password: 'user',
                database: 'test_db',
                entities: [ParcelDeliveryEntity, ActionLogEntity],
                synchronize: true,
                migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
                migrationsTableName: "migrations"

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
                load: [AppConfig, DatabaseConfig],
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
            AuthConfig,
            AuthService,
            ImportDataService,
            RedisService,
            ActionLoggerService,
            CreateParcelDeliveryUseCase,
            GetParcelDeliveryUseCase,
            RedisRepository,
            ParcelDeliveryRepository,
            ActionLogRepository,
            redisClientFactory
        ],
    }).compile();

}

