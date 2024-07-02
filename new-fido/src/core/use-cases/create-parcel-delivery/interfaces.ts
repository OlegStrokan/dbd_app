import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type";
import { ParcelDelivery } from "@app/core/entities/parcel-delivery";

export interface ICreateParcelDeliveryUseCase {
  create(dto: CreateParcelDeliveryInput): Promise<ParcelDelivery>;
}
