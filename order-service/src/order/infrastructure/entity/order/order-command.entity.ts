import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from 'src/libs/database/base.entity';
import { OrderItemCommand } from '../order-item/command/order-item-command.entity';
import { ParcelCommand } from '../parcel/command/parcel-command.entity';
import { RepaymentPreferencesCommand } from '../repayment-preferences/repayment-preferences-command.entity';

@Entity('order_command')
export class OrderCommand extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    customerId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column()
    status: string;

    @Column({ nullable: true })
    deliveryAddress: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    specialInstructions: string;

    // TODO delete cascade
    @OneToMany(() => OrderItemCommand, (item) => item.orderCommand, {
        cascade: true,
    })
    items: OrderItemCommand[];

    @OneToMany(() => ParcelCommand, (parcel) => parcel.order)
    parcels: ParcelCommand[];

    @OneToMany(() => RepaymentPreferencesCommand, (repaymentPreferences) => repaymentPreferences.order)
    repaymentPreferences: RepaymentPreferencesCommand[];
}
