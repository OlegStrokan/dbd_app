import {Clonable} from "../../../shared/utils/clonable";
import {Immutable} from "../../../shared/types/immutable";

export interface IParcelDelivery {
    id: string;
    parcelNumber: string;
    name: string;
}

export class ParcelDelivery implements Clonable<ParcelDelivery> {

    constructor(private parcelDelivery: IParcelDelivery) {}


     get data(): Immutable<IParcelDelivery> {
        return this.parcelDelivery
    }
    clone(): ParcelDelivery {
        return new ParcelDelivery({ ...this.parcelDelivery })
    }

}


