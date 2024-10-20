export class ShipOrderCommand {
    constructor(
        public readonly id: string,
        public readonly trackingNumber: string,
        public readonly deliveryDate: Date
    ) {}
}
