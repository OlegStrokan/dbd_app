import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderQuery } from './order-query.entity';

@Injectable()
export class OrderQueryRepository {
  constructor(
    @InjectRepository(OrderQuery)
    private readonly repository: Repository<OrderQuery>
  ) {}

  async saveOrder(order: OrderQuery): Promise<OrderQuery> {
    return await this.repository.save(order);
  }
}
