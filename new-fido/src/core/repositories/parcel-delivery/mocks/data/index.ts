import { faker } from "@faker-js/faker/locale/en_US";
import { generateUuid } from "../../../../../libs/generateUuid/generateUuid";
import {
  IParcelDelivery,
  ParcelDelivery,
} from "../../../../entities/parcel-delivery";
import { TestingModule } from "@nestjs/testing";
import { IParcelDeliveryRepository } from "../../index";
import { ParcelDeliveryRepository } from "../../../../../infrastructure/repositories/parcel-delivery";
import { Optional } from "../../../../../libs/typescript";

export const getRandomParcelDelivery = ({
  id = generateUuid(),
  parcelNumber = faker.string.numeric(),
}: Partial<IParcelDelivery> = {}): IParcelDelivery => ({
  id,
  parcelNumber,
});

export const createParcelDelivery = async (
  overrides: Optional<IParcelDelivery, "id">,
  module: TestingModule
): Promise<IParcelDelivery> => {
  const repository = module.get<IParcelDeliveryRepository>(
    ParcelDeliveryRepository
  );
  const parcelDelivery = new ParcelDelivery({
    id: overrides.id ?? generateUuid(),
    ...overrides,
  });
  await repository.upsertOne(parcelDelivery.data);

  return await repository.findOneById(parcelDelivery.data.id);
};
