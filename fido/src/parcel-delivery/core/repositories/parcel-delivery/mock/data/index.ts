import {faker} from "@faker-js/faker/locale/en_US";
import {generateUuid} from "../../../../../../shared/utils/generateUuid";
import {IParcelDelivery, ParcelDelivery} from "../../../../entities";
import {TestingModule} from "@nestjs/testing";
import {IParcelDeliveryRepository} from "../../index";
import {ParcelDeliveryRepository} from "../../../../../infrastructure/repositories/parcel-delivery";
import {CreateParcelDeliveryInput} from "../../../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";

export const getRandomParcelDelivery = ({
    id = generateUuid(),
    name = faker.lorem.word(),
    parcelNumber = faker.string.numeric() }: Partial<IParcelDelivery> = {} ): IParcelDelivery => ({
    id, name, parcelNumber
});


export const createParcelDelivery = async (overrides: CreateParcelDeliveryInput, module: TestingModule): Promise<IParcelDelivery> => {
    const repository = module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository)
   const parcelDelivery = new ParcelDelivery({
       id: generateUuid(),
       ...overrides
   })
    await repository.upsertOne(parcelDelivery.data)

    return await repository.findOneById(parcelDelivery.data.id)
}
