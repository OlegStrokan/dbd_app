import {createActionLog, createManyActionLogs, getRandomActionLog} from "./data";

export const actionLogMocks = {
    getOne: getRandomActionLog,
    createOne: createActionLog,
    createMany: createManyActionLogs
}
