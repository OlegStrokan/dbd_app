import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734110903795 implements MigrationInterface {
    name = 'Migrations1734110903795';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "repayment_preferences_query" ("id" character varying NOT NULL, "customerId" character varying NOT NULL, "repaymentFrequency" character varying NOT NULL, "repaymentType" character varying NOT NULL, "bankAccountPrefix" character varying, "bankAccountNumber" character varying, "bankCode" character varying, "iban" character varying, "bic" character varying, "orderId" character varying, CONSTRAINT "PK_ce211d3a8223e54fc61777ffc2a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "repayment_preferences_query" ADD CONSTRAINT "FK_c89ef2904fb23a6a67da9102a32" FOREIGN KEY ("orderId") REFERENCES "order_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "repayment_preferences_query" DROP CONSTRAINT "FK_c89ef2904fb23a6a67da9102a32"`
        );
        await queryRunner.query(`DROP TABLE "repayment_preferences_query"`);
    }
}
