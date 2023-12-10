import { ParcelDeliveryEntity } from "../../../../../domain/entities/parcel-delivery";
import {
  CreateParcelDeliveryInput
} from "../../../../use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";



export const getRandomParcelDelivery = (overrides?: ParcelDeliveryEntity) => {
  return new ParcelDeliveryEntity()
}

export const getRandomParcelDeliveryInput = (): CreateParcelDeliveryInput => {
  return {
    parcelNumber: 20392390,
    name: "Parcel"
  }
}
