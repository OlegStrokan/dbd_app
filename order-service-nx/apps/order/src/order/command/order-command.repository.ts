import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrderCommand } from './order-command.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderCommandRepository {
  constructor(
    @InjectRepository(OrderCommand)
    private readonly repository: Repository<OrderCommand>
  ) {}

  async saveOrder(order: OrderCommand): Promise<OrderCommand> {
    return await this.repository.save(order);
  }
}
