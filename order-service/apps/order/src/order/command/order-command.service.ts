import { Injectable } from '@nestjs/common';
import { OrderCommandRepository } from './order-command.repository';
import { ProducerService } from '../../services/kafka/producer/producer.service';
import { OrderItemCommand } from './order-item-command.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderCommand } from './order-command.entity';
import { OrderCreatedCommandEvent } from './order-created-command.event';

@Injectable()
export class OrderCommandService {
  constructor(
    private readonly orderCommandRepository: OrderCommandRepository,
    private readonly producerService: ProducerService
  ) {}

  async createOrder(orderData: CreateOrderDto): Promise<OrderCommand> {
    const orderCommand = new OrderCommand();
    orderCommand.customerId = orderData.customerId;
    orderCommand.totalAmount = orderData.totalAmount;
    orderCommand.status = 'created';
    orderCommand.deliveryAddress = orderData.deliveryAddress;
    orderCommand.paymentMethod = orderData.paymentMethod;
    orderCommand.specialInstructions = orderData.specialInstructions;

    orderCommand.items = orderData.items.map((itemDto) => {
      const orderItem = new OrderItemCommand();
      orderItem.productId = itemDto.productId;
      orderItem.price = itemDto.price;
      orderItem.quantity = itemDto.quantity;
      return orderItem;
    });

    const savedOrder = await this.orderCommandRepository.saveOrder(
      orderCommand
    );

    const orderCreatedEvent = new OrderCreatedCommandEvent(savedOrder);
    const message = {
      value: JSON.stringify(orderCreatedEvent),
    };

    await this.producerService.produce('order_created_topic', message);

    return savedOrder;
  }
}
