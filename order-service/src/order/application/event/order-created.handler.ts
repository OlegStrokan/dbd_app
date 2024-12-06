import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../command/create-order.command';
import { Inject } from '@nestjs/common';
import { Order } from 'src/order/domain/order/order';
import { IOrderCommandRepository } from 'src/order/domain/order/order-command.repository';
import { OrderCommandRepository } from 'src/order/infrastructure/repository/order-command.repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, void> {
    constructor(@Inject(OrderCommandRepository) private orderRepository: IOrderCommandRepository) {}
    async execute(command: CreateOrderCommand): Promise<void> {
        const parcel = Order.create(command);
        await this.orderRepository.insertOne(parcel);
    }
}
