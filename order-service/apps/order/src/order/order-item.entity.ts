import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderQuery } from './query/order-query.entity';
import { OrderCommand } from './command/order-command.service';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => OrderCommand, (order) => order.items)
  @JoinColumn({ name: 'orderCommandId' })
  orderCommand: OrderCommand;

  @ManyToOne(() => OrderQuery, (order) => order.items)
  @JoinColumn({ name: 'orderQueryId' })
  orderQuery: OrderQuery;
}
