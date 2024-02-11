import {Index} from "../../../libs/clonable";
import {Immutable} from "../../../libs/typescript";

export interface IParcelDelivery {
    id: string;
    parcelNumber: string;
    name: string;
}

export class ParcelDelivery implements Index<ParcelDelivery> {

    constructor(private parcelDelivery: IParcelDelivery) {}


     get data(): Immutable<IParcelDelivery> {
        return this.parcelDelivery
    }
    clone(): ParcelDelivery {
        return new ParcelDelivery({ ...this.parcelDelivery })
    }

}


