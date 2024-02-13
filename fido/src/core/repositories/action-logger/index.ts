import {IActionLog} from "../../services/action-logger/interfaces";
import {IPagination} from "../../../libs/pagination";
import {IClearableRepository} from "../clearable";

export interface FindAllOptions {
    pagination: IPagination
}


export interface IActionLogRepository  extends IClearableRepository {
    findOne(id: string): Promise<IActionLog>
    findAll(options: FindAllOptions): Promise<IActionLog[]>
    insertOne(action: IActionLog): Promise<IActionLog>
}
