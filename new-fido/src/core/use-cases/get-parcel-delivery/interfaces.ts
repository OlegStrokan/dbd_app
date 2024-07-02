import { ParcelDelivery } from "@app/core/entities/parcel-delivery";

export interface IGetParcelDeliveryUseCase {
  getOne(id: string): Promise<ParcelDelivery>;
}
