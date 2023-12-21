import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import {TypeOrmModule} from '@nestjs/typeorm';
import { ParcelDeliveryResolver } from "./parcel-delivery/interfaces/parcel-delivery.resolver";
import { ParcelDeliveryService } from "./parcel-delivery/core/use-cases/create-parcel-delivery";
import { ParcelDeliveryEntity } from "./parcel-delivery/infrastructure/entities/parcel-delivery";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AppConfig, DatabaseConfig} from "./parcel-delivery/infrastructure/common/config";
import {ParcelDeliveryRepository} from "./parcel-delivery/infrastructure/repositories/parcel-delivery";
import {ImportDataService} from "./parcel-delivery/core/services/import-manager";

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
    TypeOrmModule.forFeature([ParcelDeliveryEntity, ParcelDeliveryRepository])
  ],
  providers: [
      ParcelDeliveryService,
      ParcelDeliveryResolver,
      ImportDataService
  ],
})
export class ParcelDeliveryModule {}
