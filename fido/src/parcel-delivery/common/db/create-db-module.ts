import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParcelDeliveryEntity } from "../../domain/entities/parcel-delivery";
import { ParcelDeliveryService } from "../../app/use-cases/create-parcel-delivery";
import { ParcelDeliveryRepository } from "../../domain/repositories/parcel-delivery";


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
        entities: [ParcelDeliveryEntity],
        synchronize: true,
        migrations: ["src/common/migrations/*{.ts}"],
        migrationsTableName: "migrations"

      }),
      TypeOrmModule.forFeature([ParcelDeliveryEntity]),
    ],
    providers: [ParcelDeliveryService, ParcelDeliveryRepository],
  }).compile();

}

