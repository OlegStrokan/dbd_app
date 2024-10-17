import { Body, Controller, Post } from '@nestjs/common';
import { OrderCommandService } from './order-command.service';
import { CreateOrderDto } from './dtos/create-order.dto';

@Controller('/orders')
export class OrderCommandController {
  constructor(private readonly orderCommandService: OrderCommandService) {}

  @Post('')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderCommandService.createOrder(createOrderDto);
    return order;
  }
}
