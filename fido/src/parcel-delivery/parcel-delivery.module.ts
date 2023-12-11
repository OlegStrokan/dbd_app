import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelDeliveryResolver } from "./infrastructure/parcel-delivery.resolver";
import { ParcelDeliveryService } from "./app/use-cases/create-parcel-delivery";
import { ParcelDeliveryEntity } from "./domain/entities/parcel-delivery";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AppConfig, DatabaseConfig} from "./common/config";

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
    TypeOrmModule.forFeature([ParcelDeliveryEntity])
  ],
  providers: [ParcelDeliveryService, ParcelDeliveryResolver],
})
export class ParcelDeliveryModule {}
