import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { IParcelDeliveryRepository } from "@app/parcel-delivery/repository";
import { CreateParcelDeliveryDto } from "@app/parcel-delivery/use-cases/create-parcel-delivery/dto/create-parcel-delivery.dto";
import { BufferToDbService } from "@app/services/buffer-to-db/buffer-to-db.service";
import { DecodingDataService } from "@app/services/decoding-data/decoding-data.service";
import { JetStreamService } from "@app/services/jet-stream/jet-stream.service";
import { SUBJECTS } from "@app/services/jet-stream/subjects";
import { MessageBufferService } from "@app/services/message-buffer/message-buffer.service";
import { Injectable } from "@nestjs/common";
import { CronExpression } from "@nestjs/schedule";

@Injectable()
export class ParcelEventWorker extends BufferToDbService<
  CreateParcelDeliveryDto,
  CreateParcelDeliveryDto
> {
  constructor(
    jetStreamService: JetStreamService,
    messageBufferService: MessageBufferService,
    parcelDeliveryRepository: ParcelDeliveryRepository,
    decodingDataService: DecodingDataService
  ) {
    super(
      jetStreamService,
      messageBufferService,
      parcelDeliveryRepository,
      decodingDataService,
      SUBJECTS.PARCEL_EVENT,
      CronExpression.EVERY_MINUTE
    );
  }
}
