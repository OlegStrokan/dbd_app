import { Clonable } from "@app/shared/libs/clonable";
import { generateUuid } from "@app/shared/libs/generateUuid/generateUuid";
import { Immutable } from "@app/shared/libs/typescript";

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
