import {IPagination} from "../../../../shared/types/pagination";
import {LoggerAction} from "../../services/action-logger/interfaces";

export interface FindAllOptions {
    pagination: IPagination
}


export interface IActionLogRepository {
    findAll(options: FindAllOptions): Promise<LoggerAction[]>
    insertOne(action: LoggerAction): Promise<void>
}
