import {Test} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ParcelDeliveryEntity} from "../../domain/entities/parcel-delivery";
import {ParcelDeliveryService} from "../../core/use-cases/create-parcel-delivery";
import {ParcelDeliveryRepository} from "../../domain/repositories/parcel-delivery";
import {ImportDataService} from "../../core/services/import-manager";


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
                migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
                migrationsTableName: "migrations"

            }),
            TypeOrmModule.forFeature([ParcelDeliveryEntity, ParcelDeliveryRepository]),
        ],
        providers: [
            ImportDataService,
            ParcelDeliveryService,
            ParcelDeliveryRepository
        ],
    }).compile();

}

