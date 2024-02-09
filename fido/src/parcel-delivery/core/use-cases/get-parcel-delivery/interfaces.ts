import {ParcelDeliveryEntity} from "../../../infrastructure/entities/parcel-delivery";

export interface IGetParcelDeliveryUseCase {
    getOne(id: string): Promise<ParcelDeliveryEntity>
}
