import { SumReport } from "@app/core/entities/sum-report";

export interface IGetSumReportUseCase {
    getReport(): Promise<SumReport>
}