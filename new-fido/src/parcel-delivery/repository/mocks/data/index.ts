import { IParcelDelivery, ParcelDelivery } from "@app/parcel-delivery/entity";
import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { generateUuid } from "@app/shared/libs/generateUuid/generateUuid";
import { Optional } from "@app/shared/libs/typescript";
import { faker } from "@faker-js/faker/locale/en_US";
import { TestingModule } from "@nestjs/testing";
import { IParcelDeliveryRepository } from "../..";

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

  return await (
    await repository.findOneById(parcelDelivery.data.id)
  ).data;
};
