import { ParcelEvent } from "../..";
import * as faker from "faker";

export const getRandomParcelEventData = (): ParcelEvent => {
  const parcelEvent = new ParcelEvent();
  parcelEvent.id = faker.datatype.uuid();
  parcelEvent.parcelNumber = faker.datatype.number().toString();

  const date = new Date();
  const dateString = `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}T${String(
    date.getUTCHours()
  ).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}:${String(
    date.getUTCSeconds()
  ).padStart(2, "0")}.000Z`;

  parcelEvent.createdAt = dateString;
  parcelEvent.updatedAt = dateString;
  parcelEvent.weight = parseFloat(faker.commerce.price());
  return parcelEvent;
};
