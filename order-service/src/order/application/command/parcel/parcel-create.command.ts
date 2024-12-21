import { Dimension } from 'src/order/domain/shipping-cost/shipping-cost';
import { CreateOrderItemCommand } from '../order-item/create-order-item.command';

export class ParcelCreateCommand {
    constructor(
        public readonly weight: number,
        public readonly dimensions: Dimension,
        public readonly orderId: string,
        public readonly items?: CreateOrderItemCommand[]
    ) {}
}
