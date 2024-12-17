import { IClone } from 'src/libs/helpers/clone.interface';
import { Parcel } from '../parcel/parcel';
import { HasMany } from 'src/libs/helpers/db-relationship.interface';

export type ShippingDimentions = {
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
    dimensions: ShippingDimentions;
    shippingOptions: ShippingOptions;
    calculatedCost: number;
    parcels: HasMany<Parcel>;
};

export class ShippingCost implements IClone<ShippingCost> {
    constructor(public readonly shippingCostData: ShippingCostData) {}

    static create(shippingCostData: Omit<ShippingCostData, 'calculatedCost'>) {
        const { orderId } = shippingCostData;
        const calculatedCost = this.calculateShippingCost({ ...shippingCostData });
        return new ShippingCost({
            ...shippingCostData,
            calculatedCost,
        });
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

    get data(): ShippingCostData {
        return this.shippingCostData;
    }

    loadOrderItems(orderItems: Parcel[]): ShippingCost {
        const clone = this.clone();
        clone.shippingCostData.parcels = HasMany.loaded(orderItems, 'shippingConst.parcels');
        return clone;
    }

    clone(): ShippingCost {
        return new ShippingCost({ ...this.shippingCostData });
    }
}
