import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderQuery } from "./query/order-query.entity";

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

    @Column({ type: 'decimal', precision: 10, scale: 2})
    price: number;

    @ManyToOne(() => OrderQuery, (order) => order.items)
    @JoinColumn([name: 'orderId']);
    order: OrderQuery;
}