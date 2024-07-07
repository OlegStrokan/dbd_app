import { Module } from "@nestjs/common";
import { BufferToDbService } from "./buffer-to-db.service";

@Module({
  providers: [BufferToDbService],
  exports: [BufferToDbService],
})
export class BufferToDbModule {}
