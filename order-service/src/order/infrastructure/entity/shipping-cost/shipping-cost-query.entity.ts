import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { ParcelQuery } from '../parcel/parcel-query.entity';

@Entity('shipping_cost_query')
export class ShippingCostQuery {
    @PrimaryColumn()
    id: string;

    @Column()
    orderId: string;

    @Column('float')
    calculatedCost: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => ParcelQuery, (parcel) => parcel.shippingCost)
    parcels: ParcelQuery[];
}
