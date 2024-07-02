import { ParcelDeliveryEntity } from "@app/infrastructure/entities/parcel-delivery";
import { ParcelDeliveryGQL } from "../response-type";
import { Injectable } from "@nestjs/common";
import { ParcelDelivery } from "@app/core/entities/parcel-delivery";
import { IMapper } from "@app/interfaces/types/mapper";

@Injectable()
export class ParcelDeliveryMapper
  implements IMapper<ParcelDeliveryGQL, ParcelDelivery, ParcelDeliveryEntity>
{
  toCoreEntity(dbEntity: ParcelDeliveryEntity): ParcelDelivery {
    return new ParcelDelivery({
      id: dbEntity.id,
      parcelNumber: dbEntity.parcelNumber,
    });
  }

  toGQLEntity(coreEntity: ParcelDelivery): ParcelDeliveryGQL {
    return {
      id: coreEntity.data.id,
      parcelNumber: coreEntity.data.parcelNumber,
    };
  }
}
