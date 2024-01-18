import { CreateParcelDeliveryInput } from "./dto/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";

export interface IParcelDeliveryUseCase {
  create(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity>
  getOne(id: number): Promise<ParcelDeliveryEntity>
}
