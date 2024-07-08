import { Injectable } from "@nestjs/common";
import { IBufferToDbService } from "./buffer-to-db.interface";
import { IMessageBufferService } from "../message-buffer/message-buffer-interface";
import { Cron, CronExpression } from "@nestjs/schedule";
import { JetStreamService } from "../jet-stream/jet-stream.service";
import { IJetStreamService } from "../jet-stream/jet-stream.interface";
import { MessageBufferService } from "../message-buffer/message-buffer.service";
import { DecodingDataService } from "../decoding-data/decoding-data.service";
import { ParcelDeliveryRepository } from "@app/parcel-delivery/infrastructure/repository/parcel-delivery";
import { SUBJECTS } from "../jet-stream/subjects";

// TODO delete console logs and add logger from nest
@Injectable()
export class BufferToDbService<T, D> implements IBufferToDbService {
  private readonly subjectName: SUBJECTS;
  private readonly cronRule: CronExpression;

  constructor(
    private readonly jetStreamService: JetStreamService,
    private readonly messageBufferService: MessageBufferService,
    private readonly parcelRepository: ParcelDeliveryRepository,
    private readonly decodeService: DecodingDataService,
    subjectName: SUBJECTS,
    cronRunle: CronExpression
  ) {
    this.subjectName = subjectName;
    this.cronRule = cronRunle;
  }

  private getCronRule(): CronExpression {
    return this.cronRule;
  }

  @Cron("getCronRule")
  async consumeNatsMessages(): Promise<void> {
    try {
      const messages = await this.messageBufferService.getMessageBuffer(
        this.subjectName
      );
      if (messages.length > 0) {
        const processedMessage = messages.map((msg) =>
          this.decodeService.decodeEvent(msg.data)
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
