import { Inject, Injectable } from "@nestjs/common";
import { ICreateParcelDeliveryUseCase } from "./interfaces";
import { IParcelDeliveryRepository } from "../../repository";
import { CreateParcelDeliveryDto } from "./dto/create-parcel-delivery.dto";
import { ParcelDeliveryRepository } from "../../infrastructure/repository/parcel-delivery";
import { ParcelDeliveryAlreadyExistError } from "./error";
import {
  IActionLoggerService,
  KnownActionNames,
} from "../../../services/action-logger/services/interfaces";
import { ActionLoggerService } from "../../../services/action-logger/services";
import { ParcelDelivery } from "@app/parcel-delivery/entity";

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
