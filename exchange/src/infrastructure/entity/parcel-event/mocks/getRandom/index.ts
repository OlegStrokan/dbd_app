import { ParcelEvent } from "../..";
import * as faker from "faker";

export const getRandomParcelEventData = (): ParcelEvent => {
  const parcelEvent = new ParcelEvent();
  parcelEvent.id = faker.datatype.uuid();
  parcelEvent.parcelNumber = faker.random.number().toString();
  parcelEvent.createdAt = faker.date.past().toISOString();
  parcelEvent.updatedAt = faker.date.recent().toISOString();
  parcelEvent.weight = parseFloat(faker.commerce.price());
  return parcelEvent;
};
