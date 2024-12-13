import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734110888092 implements MigrationInterface {
    name = 'Migrations1734110888092';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "repayment_preferences_command" ("id" character varying NOT NULL, "customerId" character varying NOT NULL, "repaymentFrequency" character varying NOT NULL, "repaymentType" character varying NOT NULL, "bankAccountPrefix" character varying, "bankAccountNumber" character varying, "bankCode" character varying, "iban" character varying, "bic" character varying, "orderId" character varying, CONSTRAINT "PK_b366e945e34dc878d1b59faae22" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "repayment_preferences_command" ADD CONSTRAINT "FK_9a47dc845011b9aa1d4e845e5f7" FOREIGN KEY ("orderId") REFERENCES "order_command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "repayment_preferences_command" DROP CONSTRAINT "FK_9a47dc845011b9aa1d4e845e5f7"`
        );
        await queryRunner.query(`DROP TABLE "repayment_preferences_command"`);
    }
}
