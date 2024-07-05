import { SumReport } from "@app/core/entities/sum-report";
import { IGetSumReportUseCase } from "./interfaces";

export class GetSumReportUseCase implements IGetSumReportUseCase {
  constructor() {}
  async getReport(): Promise<SumReport> {
    return new SumReport({ id: "20398", total: 2039 });
  }
}
