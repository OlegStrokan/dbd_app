import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
  exports: [],
  providers: [],
})
export class WorkerModule {}
