export class CreateOrderCommand {
    constructor(public readonly customerId: string, public readonly totalAmount: number) {}
}
