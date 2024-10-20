export class AddOrderItemCommand {
    constructor(public readonly orderId: string, public readonly item: OrderItem) {}
}
