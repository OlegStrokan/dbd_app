export class CalculateShippingCostCommand {
    constructor(
        public readonly orderId: string,
        public readonly weight: number,
        public readonly dimensions: { length: number; width: number; height: number },
        public readonly shippingOptions: { expressDelivery: boolean; fragileHandling: boolean; insurance: boolean }
    ) {}
}
