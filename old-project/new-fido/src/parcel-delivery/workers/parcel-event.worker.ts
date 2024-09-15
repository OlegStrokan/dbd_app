import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { DecodingDataService } from "@app/services/decoding-data/decoding-data.service";
import { JetStreamService } from "@app/services/jet-stream/jet-stream.service";
import { SUBJECTS } from "@app/services/jet-stream/subjects";
import { MessageBufferService } from "@app/services/message-buffer/message-buffer.service";
import { IWorker } from "@app/shared/interfaces/types/worker/IWorker";
import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import { CronExpression, Cron } from "@nestjs/schedule";

// TODO delete console logs and add logger from nest
@Injectable()
export class ParcelEventWorker implements OnModuleDestroy, IWorker {
  private readonly subjectName: SUBJECTS = SUBJECTS.PARCEL_EVENT;

  constructor(
    private readonly jetStreamService: JetStreamService,
    private readonly messageBufferService: MessageBufferService,
    private readonly parcelRepository: ParcelDeliveryRepository,
    private readonly decodeService: DecodingDataService
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async consumeNatsMessages(): Promise<void> {
    console.log("init worker");
    try {
      const messages = await this.messageBufferService.getMessageBuffer(
        this.subjectName
      );
      if (messages.length > 0) {
        const processedMessage = messages.map((msg) =>
          this.decodeService.decodeEvent(msg)
        );

        // TODO delete type assertion
        await this.parcelRepository.upsertMany(
          processedMessage as unknown as any[]
        );
        this.messageBufferService.clearMessageBuffer(this.subjectName);
      } else {
        console.log(`No messages to process for ${this.subjectName}`);
      }
    } catch (error) {
      console.error(`Error consuming messages for ${this.subjectName}`, error);
    }
  }

  async onModuleDestroy() {
    await this.jetStreamService.onModuleDestroy();
  }
}
