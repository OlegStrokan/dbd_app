import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderQuery } from './order-query.entity';

@Entity('order_item_query')
export class OrderItemQuery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => OrderQuery, (order) => order.items)
  @JoinColumn({ name: 'orderQueryId' })
  orderQuery: OrderQuery;
}
