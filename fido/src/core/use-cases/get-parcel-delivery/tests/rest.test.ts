import {createDbTestingModule} from "../../../../infrastructure/common/db/create-db-module";
import {TestingModule} from "@nestjs/testing";
import {IParcelDeliveryRepository} from "../../../repositories/parcel-delivery";
import {GetParcelDeliveryUseCase} from "../index";
import {ParcelDeliveryRepository} from "../../../../infrastructure/repositories/parcel-delivery";
import {IGetParcelDeliveryUseCase} from "../interfaces";
import {parcelDeliveryMocks} from "../../../repositories/parcel-delivery/mock";

describe('ParcelDeliveryService', () => {
    let parcelDeliveryService: IGetParcelDeliveryUseCase;
    let parcelDeliveryRepository: IParcelDeliveryRepository
    let module: TestingModule;

    beforeAll(async () => {
        module = await createDbTestingModule();

        parcelDeliveryService = module.get<IGetParcelDeliveryUseCase>(GetParcelDeliveryUseCase);
        parcelDeliveryRepository = module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository)


    });

    afterAll(async () => {
        await parcelDeliveryRepository.deleteAll()
        await module.close();
    });


    it('should create a parcel delivery and verify its existence', async () => {

        const createdParcel  = await parcelDeliveryMocks.createOne({
            name: "USB-C kabel 2m", parcelNumber: '200392903'
        }, module)

        const foundParcelDelivery = await parcelDeliveryService.getOne(createdParcel.id);

        expect(foundParcelDelivery).toBeDefined();
    });
});
