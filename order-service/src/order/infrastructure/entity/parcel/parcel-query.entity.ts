import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/libs/database/base.entity';
import { OrderItemQuery } from '../order-item/query/order-item-query.entity';
import { ShippingCostQuery } from '../shipping-cost/shipping-cost-query.entity';

@Entity('parcel_query')
export class ParcelQuery extends BaseEntity {
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

    @OneToMany(() => OrderItemQuery, (item) => item.parcel)
    items: OrderItemQuery[];

    @ManyToOne(() => ShippingCostQuery, (shippingCost) => shippingCost.parcels, { nullable: false })
    @JoinColumn({ name: 'shipping_cost_id' })
    shippingCost: ShippingCostQuery;
}
