import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { OrderQuery } from '../order/order-query.entity';

@Entity('repayment_preferences_query')
export class RepaymentPreferencesQuery {
    @PrimaryColumn()
    id: string;

    @Column()
    customerId: string;

    @Column()
    repaymentFrequency: string;

    @Column()
    repaymentType: string;

    @Column({ nullable: true })
    bankAccountPrefix: string;

    @Column({ nullable: true })
    bankAccountNumber: string;

    @Column({ nullable: true })
    bankCode: string;

    @Column({ nullable: true })
    iban: string;

    @Column({ nullable: true })
    bic: string;

    @ManyToOne(() => OrderQuery, (order) => order.repaymentPreferences)
    order: OrderQuery;
}
