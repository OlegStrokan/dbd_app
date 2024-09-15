import { CreateParcelDeliveryInput } from "../../resolver/request-type";
import { ParcelDelivery } from "@app/parcel-delivery/entity";

export interface ICreateParcelDeliveryUseCase {
  create(dto: CreateParcelDeliveryInput): Promise<ParcelDelivery>;
}
