import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderCommand } from './order-command.entity';

@Entity('order_item_command')
export class OrderItemCommand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => OrderCommand, (order) => order.items)
  @JoinColumn({ name: 'orderCommandId' })
  orderCommand: OrderCommand;
}
