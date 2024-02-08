import {Optional} from "../../../../shared/types/optional";
import {FindAllOptions} from "../../repositories/action-logger";


export enum ActionType {
    Attempt = 'attempt',
    Success = 'success',
    Failure = 'failure',
}

export enum KnownActionNames {
    Test = 'Test'
}

export type ActionToLog = Omit<LoggerAction<KnownActionNames>, 'timestamp'>


export interface LoggerAction<TName extends string = string> {
    id: string;
    name: TName,
    type: ActionType,
    author: unknown,
    parentActionId: string
    details?: Record<string, unknown>,
    timestamp: string
}

export interface IActionLoggerService {
    getLoggedAction(options: FindAllOptions): Promise<LoggerAction[]>
    logAction(action: Optional<ActionToLog, 'parentActionId'>): void
    attemptAction<T>(args: Omit<ActionToLog, 'type' | 'id' | 'parentActionId'>, func: () => Promise<T>): Promise<T>
}
