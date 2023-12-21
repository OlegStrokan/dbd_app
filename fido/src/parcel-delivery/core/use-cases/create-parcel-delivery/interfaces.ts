import { CreateParcelDeliveryInput } from "./dto/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";

export interface IParcelDelivery {
  create(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity>
  getOne(id: number): Promise<ParcelDeliveryEntity>
}
