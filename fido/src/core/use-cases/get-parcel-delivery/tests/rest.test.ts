import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {TestingModule} from "@nestjs/testing";
import {IParcelDeliveryRepository} from "../../../repositories/parcel-delivery";
import {GetParcelDeliveryUseCase} from "../index";
import {ParcelDeliveryRepository} from "../../../../infrastructure/repositories/parcel-delivery";
import {IGetParcelDeliveryUseCase} from "../interfaces";
import {parcelDeliveryMocks} from "../../../repositories/parcel-delivery/mocks";
import {IRedisService} from "../../../services/redis/interfaces";
import {RedisService} from "../../../services/redis";
import {RedisPrefixes} from "../../../repositories/redis";
import {generateUuid} from "../../../../libs/generateUuid/generateUuid";
import {clearRepos} from "../../../../infrastructure/common/config/clear.config";

describe('GetParcelDeliveryUseCase', () => {
    let parcelDeliveryUseCase: IGetParcelDeliveryUseCase;
    let redisService: IRedisService;
    let parcelDeliveryRepository: IParcelDeliveryRepository
    let module: TestingModule;
    let parcelId: string;
    beforeAll(async () => {
        module = await createDbTestingModule();

        parcelDeliveryUseCase = module.get<IGetParcelDeliveryUseCase>(GetParcelDeliveryUseCase);
        redisService = module.get<IRedisService>(RedisService);
        parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository)
        parcelId = generateUuid()

    });

    beforeEach(async () => {
        await redisService.deleteWithPrefix(RedisPrefixes.PARCEL, parcelId)
        await clearRepos(module)
    })

    afterAll(async () => {
        await module.close();
    });


    it('should create a parcel delivery if cache exist and verify its existence', async () => {

        const createdParcel  = parcelDeliveryMocks.getOne({
            id: parcelId,
            name: "USB-C kabel 2m",
            parcelNumber: '200392903'
        })

        await redisService.setWithPrefix(RedisPrefixes.PARCEL, createdParcel.id, JSON.stringify(createdParcel))

        const foundParcelDelivery = await parcelDeliveryUseCase.getOne(createdParcel.id);

        expect(foundParcelDelivery).toBeDefined();
    });
});
