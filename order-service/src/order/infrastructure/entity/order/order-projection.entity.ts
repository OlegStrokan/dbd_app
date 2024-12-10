import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('order_projection')
export class OrderProjection {
    @PrimaryColumn()
    id: string;

    @Column()
    customerId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    shippedAt: Date;

    @Column({ nullable: true })
    deliveredAt: Date;

    @Column({ nullable: true })
    deliveryDate: Date;

    @Column({ nullable: true })
    deliveryAddress: string;

    @Column('json', { nullable: true })
    items: any[];
}
