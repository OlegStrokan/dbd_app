import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActionLogEntity } from "./entity";
import { ActionLoggerService } from "./services";
import { ActionLogRepository } from "./infractructure/repository";

@Module({
  imports: [TypeOrmModule.forFeature([ActionLogEntity])],
  providers: [ActionLoggerService, ActionLogRepository],
  exports: [ActionLoggerService, ActionLogRepository],
})
export class ActionLoggerModule {}
