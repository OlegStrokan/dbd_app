import { ParcelDelivery } from "@app/parcel-delivery/entity";

export interface IGetParcelDeliveryUseCase {
  getOne(id: string): Promise<ParcelDelivery>;
}
