import { Inject, Injectable } from "@nestjs/common";
import { ICreateParcelDeliveryUseCase } from "./interfaces";
import { ParcelDeliveryEntity } from "../../../infrastructure/entities/parcel-delivery";
import { IParcelDeliveryRepository } from "../../repositories/parcel-delivery";
import { CreateParcelDeliveryDto } from "./dto/create-parcel-delivery.dto";
import { ParcelDeliveryRepository } from "../../../infrastructure/repositories/parcel-delivery";
import { ParcelDeliveryAlreadyExistError } from "./error";
import {
  IActionLoggerService,
  KnownActionNames,
} from "../../services/action-logger/interfaces";
import { ActionLoggerService } from "../../services/action-logger";
import { ParcelDelivery } from "@app/core/entities/parcel-delivery";

@Injectable()
export class CreateParcelDeliveryUseCase
  implements ICreateParcelDeliveryUseCase
{
  constructor(
    @Inject(ParcelDeliveryRepository)
    public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
    @Inject(ActionLoggerService)
    public readonly actionLogger: IActionLoggerService
  ) {}

  async create(dto: CreateParcelDeliveryDto): Promise<ParcelDelivery> {
    return await this.actionLogger.attemptAction(
      {
        name: KnownActionNames.ParcelDeliveryCreate,
        // TODO - add user data to action payload. maybe use context as second parameter to service
        details: {
          ...dto,
        },
      },
      async () => {
        const foundParcel =
          await this.parcelDeliveryRepository.findByParcelNumber(
            dto.parcelNumber
          );

        if (foundParcel) {
          throw new ParcelDeliveryAlreadyExistError(
            "Parcel with current parcel number already exist ",
            { parcelDeliveryId: foundParcel.data.id }
          );
        }

        return await this.parcelDeliveryRepository.upsertOne(dto);
      }
    );
  }
}
