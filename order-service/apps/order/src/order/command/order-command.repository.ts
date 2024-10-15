import { Repository } from 'typeorm';
import { OrderCommand } from './order-command.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderCommandRepository extends Repository<OrderCommand> {
  async saveOrder(order: OrderCommand): Promise<OrderCommand> {
    return await this.save(order);
  }
}
