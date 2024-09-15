import { Clonable } from "@app/shared/libs/clonable";
import { generateUuid } from "@app/shared/libs/generateUuid/generateUuid";
import { Immutable } from "@app/shared/libs/typescript";

export interface ISumReport {
  id: string;
  total: number;
}

export class SumReport implements Clonable<SumReport> {
  constructor(private sumReport: ISumReport) {}

  static create = (sumReportData: Omit<ISumReport, "id">) => {
    new SumReport({
      id: generateUuid(),
      ...sumReportData,
    });
  };

  get data(): Immutable<ISumReport> {
    return this.sumReport;
  }

  clone(): SumReport {
    return new SumReport({ ...this.sumReport });
  }
}
