import { ParcelDeliveryEntity } from "../../../../../domain/entities/parcel-delivery";
import {
  CreateParcelDeliveryInput
} from "../../../../use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";

export const getRandomParcelDelivery = (overrides?: Partial<ParcelDeliveryEntity>): ParcelDeliveryEntity => {
  const defaultParcel: ParcelDeliveryEntity = new ParcelDeliveryEntity();

  if (overrides) {
    Object.assign(defaultParcel, overrides);
  }

  return defaultParcel;
};


export const getRandomParcelDeliveryInput = (): CreateParcelDeliveryInput => {
  return {
    parcelNumber: 20392390,
    name: "Parcel"
  }
}
