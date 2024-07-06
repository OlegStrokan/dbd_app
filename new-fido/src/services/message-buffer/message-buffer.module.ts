import { Module } from "@nestjs/common";
import { MessageBufferService } from "./message-buffer.service";

@Module({
  providers: [MessageBufferService],
  exports: [MessageBufferService],
})
export class MessageBufferModule {}
