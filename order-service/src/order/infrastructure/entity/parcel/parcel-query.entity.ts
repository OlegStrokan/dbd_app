import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/libs/database/base.entity';
import { OrderItemQuery } from '../order-item/query/order-item-query.entity';
import { ShippingCostQuery } from '../shipping-cost/shipping-cost-query.entity';
import { Dimension } from 'src/order/domain/shipping-cost/shipping-cost';

@Entity('parcel_query')
export class ParcelQuery extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    trackingNumber: string;

    @Column('decimal')
    weight: number;

    @Column()
    dimensions: Dimension;

    @Column()
    orderId: string;

    @OneToMany(() => OrderItemQuery, (item) => item.parcel)
    items: OrderItemQuery[];

    @ManyToOne(() => ShippingCostQuery, (shippingCost) => shippingCost.parcels, { nullable: true })
    shippingCost: ShippingCostQuery;
}
