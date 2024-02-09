import {Module} from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import {TypeOrmModule} from '@nestjs/typeorm';
import {Index} from "./parcel-delivery/interfaces/parcel-delivery";
import {CreateParcelDeliveryUseCase} from "./parcel-delivery/core/use-cases/create-parcel-delivery";
import {ParcelDeliveryEntity} from "./parcel-delivery/infrastructure/entities/parcel-delivery";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AppConfig, DatabaseConfig} from "./parcel-delivery/infrastructure/common/config";
import {ParcelDeliveryRepository} from "./parcel-delivery/infrastructure/repositories/parcel-delivery";
import {ImportDataService} from "./parcel-delivery/core/services/import-manager";
import {ScheduleModule} from "@nestjs/schedule";
import {ActionLogger} from "./parcel-delivery/core/services/action-logger";

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
        TypeOrmModule.forFeature([ParcelDeliveryEntity, ParcelDeliveryRepository])
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
