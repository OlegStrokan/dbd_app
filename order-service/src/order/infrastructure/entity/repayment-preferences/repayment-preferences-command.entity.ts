import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { OrderCommand } from 'src/order/infrastructure/entity/order/order-command.entity'; // Adjust the import path as necessary

@Entity('repayment_preferences_command')
export class RepaymentPreferencesCommand {
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

    @ManyToOne(() => OrderCommand, (order) => order.repaymentPreferences)
    order: OrderCommand;
}
