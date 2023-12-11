import { CreateParcelDeliveryInput } from "../../use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../domain/entities/parcel-delivery";

export interface IParcelDeliveryRepository {
  create(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity>;
  findOneById(id: ParcelDeliveryEntity['id']): Promise<ParcelDeliveryEntity>
  findAll(): Promise<ParcelDeliveryEntity[]>
}
