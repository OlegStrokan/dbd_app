import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";

export interface ICreateParcelDeliveryUseCase {
  create(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity>
}
