import { Entity, Column, ManyToOne, PrimaryColumn, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/libs/database/base.entity';
import { OrderItemCommand } from '../../order-item/command/order-item-command.entity';
import { OrderCommand } from '../../order/order-command.entity';

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
}
