import { getRandomParcelEventData } from "../../infrastructure/entity/parcel-event/mocks/getRandom";
import { AppDataSource } from "../../infrastructure/database.config";

export const createParcelEvent = async () => {
  const parcelEvent = getRandomParcelEventData();
  try {
    await AppDataSource.manager.save(parcelEvent);
  } catch (error) {
    console.log("Error saving parcel event", error);
  }
  console.log("Parcel event created", parcelEvent);
};
