import { IActionLog } from "../services/interfaces";
import { IPagination } from "../../../shared/libs/pagination";
import { IClearableRepository } from "../../../shared/interfaces/types/clearable";

export interface FindAllOptions {
  pagination: IPagination;
}

export interface IActionLogRepository extends IClearableRepository {
  findOne(id: string): Promise<IActionLog>;
  findAll(options: FindAllOptions): Promise<IActionLog[]>;
  insertOne(action: IActionLog): Promise<IActionLog>;
}
