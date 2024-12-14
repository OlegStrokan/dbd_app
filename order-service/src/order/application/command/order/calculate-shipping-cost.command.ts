// src/order/application/command/shipping-cost/calculate-shipping-cost.command.ts
export class CalculateShippingCostCommand {
    constructor(
        public readonly orderId: string,
        public readonly weight: number,
        public readonly dimensions: { length: number; width: number; height: number },
        public readonly shippingOptions: { expressDelivery: boolean; fragileHandling: boolean; insurance: boolean }
    ) {}
}
