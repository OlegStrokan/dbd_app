import { Controller, Get, Param } from '@nestjs/common';
import { OrderQueryService } from './order-query.service';
import { OrderQuery } from './order-query.entity';
import { MessagePattern } from '@nestjs/microservices';
import { OrderCreatedQueryEvent } from './order-created-query.event';

@Controller('/orders')
export class OrderQueryController {
  constructor(private readonly orderQueryService: OrderQueryService) {}

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<OrderQuery> {
    return this.orderQueryService.findById(id);
  }

  @Get('')
  async getAllOrders(): Promise<OrderQuery[]> {
    return this.orderQueryService.findAll();
  }

  @MessagePattern('order_created_topic')
  async handleOrderCreated(event: OrderCreatedQueryEvent) {
    await this.orderQueryService.handleOrderCreated(event);
  }
}
