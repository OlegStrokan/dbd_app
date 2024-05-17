import { ParcelEventRepository } from "../../../infrastructure/repository/parcel-event/index";
import { AppDataSource } from "../../../infrastructure/database.config";
import { connect } from "nats";
import { NatsService } from "../../../infrastructure/nats/index";

export const createApiContainer = async () => {
  const dataSource = await AppDataSource.initialize();
  const nats = new NatsService();

  const parcelEventRepository = new ParcelEventRepository();

  return {
    parcelEventRepository,
    dataSource,
    nats,
  };
};
