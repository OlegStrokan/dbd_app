import {FindAllOptions, IActionLogRepository} from "../../../core/repositories/action-logger";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ActionLogEntity} from "../../entities/action-logger";
import {IActionLog} from "../../../core/services/action-logger/interfaces";
import {toTypeOrmLoggedActionEntity, toTypeOrmLoggedActionInsert} from "./mappers";

export class ActionLogRepository implements IActionLogRepository {
    constructor(
        @InjectRepository(ActionLogEntity)
        private readonly repository: Repository<ActionLogEntity>,
    ) {
    }

    async findOne(id: string): Promise<IActionLog> {
        const actionLog = await this.repository.findOneBy({ id })
        return  toTypeOrmLoggedActionEntity(actionLog)
    }
    async findAll({ pagination}: FindAllOptions): Promise<IActionLog[]> {
        const actionLogs =  await this.repository.find({
            take: pagination.limit,
            skip: pagination.offset
        })

        return actionLogs.map(toTypeOrmLoggedActionEntity)
    }

    async insertOne(action: IActionLog): Promise<IActionLog> {
        const actionLog  = this.repository.create(toTypeOrmLoggedActionInsert(action))
        const savedActionLog = await this.repository.save(actionLog)
        return toTypeOrmLoggedActionEntity(savedActionLog)
    }
}
