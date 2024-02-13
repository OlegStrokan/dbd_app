import {ActionType, IActionLog, KnownActionNames} from "../../../../services/action-logger/interfaces";
import {faker} from "@faker-js/faker/locale/en_US";
import {selectRandom} from "../../../../../libs/mocks/random";
import {generateUuid} from "../../../../../libs/generateUuid/generateUuid";
import {toISO8601UTC} from "../../../../../libs/dates";
import {TestingModule} from "@nestjs/testing";
import {IActionLogRepository} from "../../index";
import {ActionLogRepository} from "../../../../../infrastructure/repositories/action-logger";
import {makeArray} from "../../../../../libs/array";

export const getRandomActionLog = (): IActionLog<KnownActionNames> => ({
    id: generateUuid(),
    name: selectRandom(KnownActionNames),
    parentActionId: generateUuid(),
    type: selectRandom(ActionType),
    details: JSON.parse(faker.datatype.json()),
    author: {
        id: generateUuid(),
        email: faker.internet.email()
    },
    timestamp: toISO8601UTC(faker.date.recent())
})


export const createActionLog = async (overrides: Omit<IActionLog, 'id'>, module: TestingModule): Promise<IActionLog> => {
    const repository = module.get<IActionLogRepository>(ActionLogRepository)

    const actionLog: IActionLog = {
        id: generateUuid(),
        ...overrides
    }

    return await repository.insertOne(actionLog)
}

export const createManyActionLogs = async (
    count: number,
    overrides: (i: number) => Omit<IActionLog, 'id'>, module: TestingModule): Promise<IActionLog[]> => {

    return Promise.all(makeArray(count, async (i) => {
        const actionLog: IActionLog = {
            id: generateUuid(),
            ...overrides(i)
        }
        return await createActionLog(actionLog, module)
    }))
}
