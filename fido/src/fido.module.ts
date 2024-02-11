import {Module} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import {TypeOrmModule} from '@nestjs/typeorm';
import {Index} from "./interfaces/parcel-delivery";
import {CreateParcelDeliveryUseCase} from "./core/use-cases/create-parcel-delivery";
import {ParcelDeliveryEntity} from "./infrastructure/entities/parcel-delivery";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AppConfig, DatabaseConfig} from "./infrastructure/common/config";
import {ParcelDeliveryRepository} from "./infrastructure/repositories/parcel-delivery";
import {ImportDataService} from "./core/services/import-manager";
import {ScheduleModule} from "@nestjs/schedule";
import {ActionLogger} from "./core/services/action-logger";
import {ActionLogEntity} from "./infrastructure/entities/action-logger";
import {ActionLogRepository} from "./infrastructure/repositories/action-logger";

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
            ActionLogEntity,
            ActionLogRepository
        ])
    ],
    providers: [
        CreateParcelDeliveryUseCase,
        Index,
        ImportDataService,
        ActionLogger
    ],
})
export class FidoModule {
}