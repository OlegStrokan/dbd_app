import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { ParcelCommand } from '../parcel/parcel-command.entity';

@Entity('shipping_cost_command')
export class ShippingCostCommand {
    @PrimaryColumn()
    id: string;

    @Column()
    orderId: string;

    @Column('float')
    weight: number;

    @Column('json')
    dimensions: { length: number; width: number; height: number };

    @Column('json')
    shippingOptions: { expressDelivery: boolean; fragileHandling: boolean; insurance: boolean };

    @Column('float')
    calculatedCost: number;

    @OneToMany(() => ParcelCommand, (parcel) => parcel.shippingCost)
    parcels: ParcelCommand[];

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
