import { ShippingCost, ShippingCostData } from './shipping-cost';

export interface IShippingCostCommandRepository {
    create(data: ShippingCostData): Promise<void>;
    findByOrderId(orderId: string): Promise<ShippingCost | undefined>;
}
