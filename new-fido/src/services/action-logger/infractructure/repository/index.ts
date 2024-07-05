import { FindAllOptions, IActionLogRepository } from "../../repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActionLogEntity } from "../../entity";
import { IActionLog } from "../../services/interfaces";
import {
  toTypeOrmLoggedActionEntity,
  toTypeOrmLoggedActionInsert,
} from "./mappers";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ActionLogRepository implements IActionLogRepository {
  constructor(
    @InjectRepository(ActionLogEntity)
    private readonly repository: Repository<ActionLogEntity>
  ) {}

  public async findOne(id: string): Promise<IActionLog> {
    const actionLog = await this.repository.findOneBy({ id });
    return toTypeOrmLoggedActionEntity(actionLog);
  }
  public async findAll({ pagination }: FindAllOptions): Promise<IActionLog[]> {
    const actionLogs = await this.repository.find({
      take: pagination.limit,
      skip: pagination.offset,
    });

    return actionLogs.map(toTypeOrmLoggedActionEntity);
  }

  public async insertOne(action: IActionLog): Promise<IActionLog> {
    const actionLog = this.repository.create(
      toTypeOrmLoggedActionInsert(action)
    );
    const savedActionLog = await this.repository.save(actionLog);
    return toTypeOrmLoggedActionEntity(savedActionLog);
  }

  public async clear(): Promise<void> {
    await this.repository.clear();
  }
}
