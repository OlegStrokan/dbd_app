import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderQuery } from '../../order/order-query.entity';
import { BaseEntity } from 'src/libs/database/base.entity';
import { ParcelQuery } from '../../parcel/query/parcel-query.entity';

@Entity('order_item_query')
export class OrderItemQuery extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    productId: string;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    weight: number;

    @ManyToOne(() => OrderQuery, (order) => order.items)
    @JoinColumn({ name: 'orderQueryId' })
    orderQuery: OrderQuery;

    @ManyToOne(() => ParcelQuery, (parcel) => parcel.items, { nullable: true })
    parcel: ParcelQuery;
}
