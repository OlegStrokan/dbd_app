import {Test} from "@nestjs/testing";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {ParcelDeliveryEntity} from "../../entities/parcel-delivery";
import {CreateParcelDeliveryUseCase} from "../../../core/use-cases/create-parcel-delivery";
import {ParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {ImportDataService} from "../../../core/services/import-manager";
import {ScheduleModule} from "@nestjs/schedule";
import {GetParcelDeliveryUseCase} from "../../../core/use-cases/get-parcel-delivery";


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
            ScheduleModule.forRoot()
        ],
        providers: [
            {
                provide: getRepositoryToken(ParcelDeliveryRepository),
                useClass: ParcelDeliveryRepository,
            },
            ImportDataService,
            CreateParcelDeliveryUseCase,
            GetParcelDeliveryUseCase,
            ParcelDeliveryRepository
        ],
    }).compile();

}

