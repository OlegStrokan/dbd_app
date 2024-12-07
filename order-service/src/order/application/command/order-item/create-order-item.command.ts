// command/order-item.command.ts

export class CreateOrderItemCommand {
    public constructor(
        public readonly productId: string,
        public readonly quantity: number,
        public readonly price: number,
        public readonly weight: number
    ) {}
}
