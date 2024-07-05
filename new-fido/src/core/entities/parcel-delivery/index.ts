import { Clonable } from "../../../libs/clonable";
import { Immutable } from "../../../libs/typescript";
import { generateUuid } from "../../../libs/generateUuid/generateUuid";

export interface IParcelDelivery {
  id: string;
  parcelNumber: string;
}

export class ParcelDelivery implements Clonable<ParcelDelivery> {
  constructor(private parcelDelivery: IParcelDelivery) {}

  static create = (parcelData: Omit<IParcelDelivery, "id">) =>
    new ParcelDelivery({
      id: generateUuid(),
      ...parcelData,
    });

  get data(): Immutable<IParcelDelivery> {
    return this.parcelDelivery;
  }
  clone(): ParcelDelivery {
    return new ParcelDelivery({ ...this.parcelDelivery });
  }
}
