import { ParcelCreateCommand } from 'src/order/application/command/parcel/parcel-create.command';
import { Dimension, ShippingOptions } from '../../shipping-cost/shipping-cost';

export class CreateShippingCostCommand {
    constructor(
        public readonly orderId: string,
        public readonly weight: number,
        public readonly dimensions: Dimension,
        public readonly shippingOptions: ShippingOptions,
        public readonly parcels?: ParcelCreateCommand[]
    ) {}
}
