import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from '../order-item.entity';

@Entity('order-query')
export class OrderQuery {
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
  deliveryDate: Date;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  feedback: string;

  @Column({ nullable: true })
  specialInstructions: string;

  @OneToMany(() => OrderItem, (item) => item.orderQuery, { cascade: true })
  items: OrderItem[];
}
