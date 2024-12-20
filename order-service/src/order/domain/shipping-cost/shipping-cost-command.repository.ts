import { ShippingCost, ShippingCostData } from './shipping-cost';

export interface IShippingCostCommandRepository {
    create(data: ShippingCostData): Promise<ShippingCost>;
    findByOrderId(orderId: string): Promise<ShippingCost | undefined>;
}
