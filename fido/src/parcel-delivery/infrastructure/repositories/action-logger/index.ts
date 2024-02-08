import {FindAllOptions, IActionLogRepository} from "../../../core/repositories/action-logger";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ActionLoggerEntity} from "../../entities/action-logger";
import {LoggerAction} from "../../../core/services/action-logger/interfaces";

export class ActionLogRepository implements IActionLogRepository {
    constructor(
        @InjectRepository(ActionLoggerEntity)
        private readonly repository: Repository<LoggerAction>,
    ) {
    }

    async findAll({ pagination}: FindAllOptions): Promise<LoggerAction[]> {
        return await this.repository.find({
            take: pagination.limit,
            skip: pagination.offset
        })
    }

    async insertOne(action: LoggerAction): Promise<void> {
        await this.repository.insert(action)
    }
}
