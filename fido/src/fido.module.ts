import {Module} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import {TypeOrmModule} from '@nestjs/typeorm';
import {CreateParcelDeliveryUseCase} from "./core/use-cases/create-parcel-delivery";
import {ParcelDeliveryEntity} from "./infrastructure/entities/parcel-delivery";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AppConfig, DatabaseConfig} from "./infrastructure/common/config";
import {ParcelDeliveryRepository} from "./infrastructure/repositories/parcel-delivery";
import {ImportDataService} from "./core/services/import-manager";
import {ScheduleModule} from "@nestjs/schedule";
import {ActionLoggerService} from "./core/services/action-logger";
import {ActionLogEntity} from "./infrastructure/entities/action-logger";
import {ActionLogRepository} from "./infrastructure/repositories/action-logger";
import {RedisRepository} from "./infrastructure/repositories/redis";
import {GetParcelDeliveryUseCase} from "./core/use-cases/get-parcel-delivery";
import {RedisService} from "./core/services/redis";
import {AuthService} from "./core/services/authorization";
import {AuthConfig} from "./infrastructure/common/config/auth.config";
import {ParcelDeliveryResolver} from "./interfaces/parcel-delivery";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
            driver: ApolloFederationDriver,
            autoSchemaFile: {
                federation: 1
            }
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [AppConfig, DatabaseConfig],
            envFilePath: `.env`,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                ...configService.get('database'),
            }),
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            ParcelDeliveryEntity,
            ParcelDeliveryRepository,
            RedisRepository,
            ActionLogEntity,
            ActionLogRepository
        ])
    ],
    providers: [
        CreateParcelDeliveryUseCase,
        GetParcelDeliveryUseCase,
        ParcelDeliveryResolver,
        ImportDataService,
        ActionLoggerService,
        RedisService,
        AuthService,
        AuthConfig,
    ],
})
export class FidoModule {
}
