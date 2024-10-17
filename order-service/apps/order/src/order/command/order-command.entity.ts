import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItemCommand } from './order-item-command.entity';

@Entity('order-command')
export class OrderCommand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  deliveryAddress: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  specialInstructions: string;

  @OneToMany(() => OrderItemCommand, (item) => item.orderCommand, {
    cascade: true,
  })
  items: OrderItemCommand[];
}
