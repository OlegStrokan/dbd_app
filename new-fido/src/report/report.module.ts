import { Module } from "@nestjs/common";
import { GetSumReportUseCase } from "./use-cases/get-sum-report";

@Module({
  exports: [GetSumReportUseCase],
  providers: [GetSumReportUseCase],
})
export class ReportModule {}
