import { SumReport } from "@app/report/entities/sum-report";

export interface IGetSumReportUseCase {
  getReport(): Promise<SumReport>;
}
