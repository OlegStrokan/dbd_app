import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderQuery } from './order-query.entity';
import { OrderItemQuery } from './order-item-query.entity';
import { OrderCreatedQueryEvent } from './order-created-query.event';

@Injectable()
export class OrderQueryService {
  constructor(
    @InjectRepository(OrderQuery)
    private readonly orderQueryRepository: Repository<OrderQuery>,
    @InjectRepository(OrderItemQuery)
    private readonly orderItemQueryRepository: Repository<OrderItemQuery>
  ) {}

  async handleOrderCreated(event: OrderCreatedQueryEvent) {
    let orderQuery = await this.orderQueryRepository.findOneBy({
      id: event.orderId,
    });

    if (!orderQuery) {
      orderQuery = new OrderQuery();
      orderQuery.id = event.orderId;
      orderQuery.customerId = event.customerId;
      orderQuery.totalAmount = event.totalAmount;
      orderQuery.orderDate = event.orderDate;
      orderQuery.status = event.status;
    }

    const orderItems = event.items.map((item) => {
      const orderItem = new OrderItemQuery();
      orderItem.productId = item.productId;
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      orderItem.orderQuery = orderQuery;
      return orderItem;
    });

    await this.orderQueryRepository.save(orderQuery);
    await this.orderItemQueryRepository.save(orderItems);
  }

  async findById(id: string): Promise<OrderQuery> {
    return this.orderQueryRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<OrderQuery[]> {
    return this.orderQueryRepository.find();
  }
}
