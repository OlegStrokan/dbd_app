import {FindAllOptions} from "../../repositories/action-logger";
import {Optional} from "../../../libs/typescript";
import {AuthUser} from "../../types/auth-user";


export enum ActionType {
    Attempt = 'attempt',
    Success = 'success',
    Failure = 'failure',
}

export enum KnownActionNames {
    Test = 'Test'
}

export type ActionToLog = Omit<IActionLog<KnownActionNames>, 'timestamp'>


export interface IActionLog<TName extends string = string> {
    id: string;
    name: TName,
    type: ActionType,
    author: AuthUser,
    parentActionId: string
    details?: Record<string, unknown>,
    timestamp: string
}

export interface IActionLoggerService {
    getLoggedAction(options: FindAllOptions): Promise<IActionLog[]>
    logAction(action: Optional<ActionToLog, 'parentActionId'>): void
    attemptAction<T>(args: Omit<ActionToLog, 'type' | 'id' | 'parentActionId'>, func: () => Promise<T>): Promise<T>
}
