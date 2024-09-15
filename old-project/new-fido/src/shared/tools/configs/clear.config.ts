import { TestingModule } from "@nestjs/testing";
import { ParcelDeliveryRepository } from "../../../parcel-delivery/infrastructure/repository/parcel-delivery";
import { IParcelDeliveryRepository } from "../../../parcel-delivery/repository";
import { IActionLogRepository } from "../../../services/action-logger/repository";
import { ActionLogRepository } from "../../../services/action-logger/infractructure/repository";
import { IClearableRepository } from "../../interfaces/types/clearable";

export const clearRepos = async (module: TestingModule) => {
  const repositories = [
    module.get<IParcelDeliveryRepository>(ParcelDeliveryRepository),
    module.get<IActionLogRepository>(ActionLogRepository),
  ];

  for (const repository of repositories) {
    const retypedRepo = repository as unknown as IClearableRepository;
    if (retypedRepo.clear) {
      await retypedRepo.clear();
    }
  }
};
