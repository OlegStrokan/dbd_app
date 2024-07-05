import {
  ActionToLog,
  ActionStatus,
  IActionLoggerService,
  IActionLog,
} from "./interfaces";
import { FindAllOptions, IActionLogRepository } from "../repository";
import { Inject, Logger } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { toISO8601UTC } from "../../../shared/libs/dates";
import { Optional } from "../../../shared/libs/typescript";
import { ActionLogRepository } from "../infractructure/repository";

export class ActionLoggerService implements IActionLoggerService {
  private readonly logger = new Logger(ActionLogRepository.name);

  constructor(
    @Inject(ActionLogRepository)
    private readonly storage: IActionLogRepository
  ) {}

  public getLoggedAction = (options: FindAllOptions): Promise<IActionLog[]> => {
    return this.storage.findAll(options);
  };

  public logAction = async (
    action: Optional<ActionToLog, "parentActionId">
  ): Promise<void> => {
    const maxAttempts = 10;
    const backoffMs = 500;

    let attempt = 1;
    let success = false;

    while (attempt < maxAttempts && !success) {
      try {
        await this.storage.insertOne({
          ...action,
          parentActionId: action.parentActionId ?? uuidv4(),
          timestamp: toISO8601UTC(new Date()),
        });
        success = true;
      } catch (error) {
        this.logger.warn(
          `Failed to log action on attempt ${attempt}! Retrying...`,
          {
            reason: error instanceof Error ? error.stack : String(error),
          }
        );

        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        attempt++;
      }
    }
    if (!success) {
      this.logger.error(
        `Failed to log action after ${maxAttempts} retries! This will result in an incomplete action log! Make sure to take the appropriate actions!`,
        {
          action: JSON.stringify(action),
        }
      );
    }
  };

  public attemptAction = async <T>(
    args: Omit<ActionToLog, "type" | "id" | "parentActionId">,
    func: () => Promise<T>
  ): Promise<T> => {
    const parentActionId = uuidv4();

    await this.logAction({
      ...args,
      type: ActionStatus.Attempt,
      id: parentActionId,
      parentActionId,
      details: {
        ...args.details,
      },
    });
    try {
      const result = await func();

      await this.logAction({
        ...args,
        type: ActionStatus.Success,
        id: parentActionId,
        parentActionId,
        details: {
          ...args.details,
        },
      });
      return result;
    } catch (error) {
      await this.logAction({
        ...args,
        type: ActionStatus.Failure,
        id: uuidv4(),
        parentActionId,
        details: {
          ...args.details,
          alReason: error, // Action logger prefix with a "_" to avoid collisions (we use camel case)
        },
      });
      throw error;
    }
  };
}
