import {Clonable} from "../../../shared/utils/clonable";
import {Immutable} from "../../../shared/types/immutable";

interface IParcelDelivery {
    id: number;
    parcelNumber: number;
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


