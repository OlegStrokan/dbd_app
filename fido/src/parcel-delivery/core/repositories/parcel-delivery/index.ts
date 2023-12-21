import { CreateParcelDeliveryInput } from "../../use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";

export interface IParcelDeliveryRepository {
  upsertOne(dto: CreateParcelDeliveryInput): Promise<ParcelDeliveryEntity>;
  upsertMany(dtos: CreateParcelDeliveryInput[]): Promise<ParcelDeliveryEntity[]>;
  findOneById(id: ParcelDeliveryEntity['id']): Promise<ParcelDeliveryEntity>
  findAll(): Promise<ParcelDeliveryEntity[]>
  deleteAll(): Promise<void>
}
