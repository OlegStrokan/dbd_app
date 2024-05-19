import {TestingModule} from "@nestjs/testing";
import {ParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {IParcelDeliveryRepository} from "../../../core/repositories/parcel-delivery";
import {IActionLogRepository} from "../../../core/repositories/action-logger";
import {ActionLogRepository} from "../../repositories/action-logger";
import {IClearableRepository} from "../../../core/repositories/clearable";

export const clearRepos = async (module: TestingModule) => {
    const repositories = [
        module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository),
        module.get<IActionLogRepository>(ActionLogRepository),
    ]


    for (const repository of repositories) {
        const retypedRepo = repository as unknown as  IClearableRepository
        if (retypedRepo.clear) {
            await retypedRepo.clear()
        }
    }
}
