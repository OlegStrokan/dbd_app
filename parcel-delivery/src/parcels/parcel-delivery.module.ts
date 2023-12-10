import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloFederationDriver, ApolloFederationDriverConfig} from "@nestjs/apollo";
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelDeliveryResolver } from "./infrastructure/parcel-delivery.resolver";
import { ParcelDeliveryService } from "./app/use-cases/create-parcel-delivery";
import { ParcelDeliveryEntity } from "./domain/entities/parcel-delivery";

@Module({
  imports: [
      GraphQLModule.forRoot<ApolloFederationDriverConfig>({
        driver: ApolloFederationDriver,
        autoSchemaFile: {
          federation: 1
        }
      }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'stroka01',
          password: 'user',
          database: 'dev_db',
          entities: [ParcelDeliveryEntity],
          synchronize: true,
          migrations: ["src/common/migrations/*{.ts}"]
      }),
    TypeOrmModule.forFeature([ParcelDeliveryEntity])
  ],
  providers: [ParcelDeliveryService, ParcelDeliveryResolver],
})
export class ParcelDeliveryModule {}
