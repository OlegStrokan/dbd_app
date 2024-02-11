import {IActionLog} from "../../services/action-logger/interfaces";
import {IPagination} from "../../../libs/pagination";

export interface FindAllOptions {
    pagination: IPagination
}


export interface IActionLogRepository {
    findOne(id: string): Promise<IActionLog>
    findAll(options: FindAllOptions): Promise<IActionLog[]>
    insertOne(action: IActionLog): Promise<IActionLog>
}
