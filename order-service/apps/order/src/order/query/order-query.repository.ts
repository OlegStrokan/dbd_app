import { Injectable } from '@nestjs/common';
import { OrderQuery } from './order-query.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderQueryRepository extends Repository<OrderQuery> {
  async findById(id: string): Promise<OrderQuery> {
    return await this.findOneBy({ id });
  }
}
