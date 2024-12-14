import { Entity, Column, ManyToOne, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/libs/database/base.entity';
import { OrderItemCommand } from '../order-item/command/order-item-command.entity';
import { OrderCommand } from '../order/order-command.entity';
import { ShippingCostCommand } from '../shipping-cost/shipping-cost-command.entity';

@Entity('parcel_command')
export class ParcelCommand extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    trackingNumber: string;

    @Column('decimal')
    weight: number;

    @Column()
    dimensions: string;

    @Column()
    orderId: string;

    @ManyToOne(() => OrderCommand, (order) => order.parcels)
    order: OrderCommand;

    @OneToMany(() => OrderItemCommand, (item) => item.parcel)
    items: OrderItemCommand[];

    @ManyToOne(() => ShippingCostCommand, (shippingCost) => shippingCost.parcels, { nullable: false })
    @JoinColumn({ name: 'shipping_cost_id' })
    shippingCost: ShippingCostCommand;
}
