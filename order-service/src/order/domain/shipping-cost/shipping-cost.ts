import { IClone } from 'src/libs/helpers/clone.interface';
import { Parcel } from '../parcel/parcel';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';

export type Dimension = {
    length: number;
    width: number;
    height: number;
};

export type ShippingOptions = {
    expressDelivery: boolean;
    fragileHandling: boolean;
    insurance: boolean;
};

export type ShippingCostData = {
    orderId: string;
    weight: number;
    dimensions: Dimension;
    shippingOptions: ShippingOptions;
    calculatedCost: number;
    parcels: HasMany<Parcel> | null;
};

export type ShippingCostCreateDate = Omit<ShippingCostData, 'calculatedCost'>;
export class ShippingCost implements IClone<ShippingCost> {
    constructor(public readonly shippingCostData: ShippingCostData) {}

    get data(): ShippingCostData {
        return this.shippingCostData;
    }

    static create(shippingCostData: ShippingCostCreateDate) {
        const calculatedCost = this.calculateShippingCost({ ...shippingCostData });
        return new ShippingCost({
            ...shippingCostData,
            calculatedCost,
        });
    }

    addParcel(parcel: Parcel): ShippingCost {
        if (!parcel) {
            throw new Error('Invalid Parcel');
        }
        return this.addParcels([parcel]);
    }

    addParcels(parcels: Parcel[]): ShippingCost {
        if (!parcels || parcels.length === 0) {
            throw new Error('No parcels to add');
        }

        const existingParcels = this.shippingCostData.parcels.isLoaded() ? this.shippingCostData.parcels.get() : [];
        const totalWeight = parcels.reduce((acc, parcel) => acc + parcel.weight, 0);

        const updatedParcels = [...existingParcels, ...parcels];
        const updatedWeight = this.shippingCostData.weight + totalWeight;

        return new ShippingCost({
            ...this.shippingCostData,
            weight: updatedWeight,
            parcels: HasMany.loaded(updatedParcels, 'shippingCost.parcels'),
            calculatedCost: ShippingCost.calculateShippingCost({
                ...this.shippingCostData,
                weight: updatedWeight,
            }),
        });
    }

    loadOrderItems(orderItems: Parcel[]): ShippingCost {
        const clone = this.clone();
        clone.shippingCostData.parcels = HasMany.loaded(orderItems, 'shippingConst.parcels');
        return clone;
    }

    clone(): ShippingCost {
        return new ShippingCost({ ...this.shippingCostData });
    }

    private static calculateShippingCost(
        shippingCostData: Omit<ShippingCostData, 'orderId' | 'calculatedCost'>
    ): number {
        const { dimensions, shippingOptions, weight } = shippingCostData;

        let baseCost = weight * 5;

        const volume = dimensions.length * dimensions.width * dimensions.height;
        const sizeFactor = volume / 1000;
        baseCost += sizeFactor * 2;

        if (shippingOptions.expressDelivery) {
            baseCost += 10;
        }

        if (shippingOptions.fragileHandling) {
            baseCost += 5;
        }

        if (shippingOptions.insurance) {
            baseCost += 8;
        }

        return baseCost;
    }
}
