import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734800875373 implements MigrationInterface {
    name = 'Migrations1734800875373';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP CONSTRAINT "FK_901b7aed029d67a57c5785f2e6f"`);
        await queryRunner.query(`ALTER TABLE "parcel_query" RENAME COLUMN "shipping_cost_id" TO "shippingCostId"`);
        await queryRunner.query(
            `ALTER TABLE "parcel_query" ADD CONSTRAINT "FK_fc32c244f7512f1c08add2ce181" FOREIGN KEY ("shippingCostId") REFERENCES "shipping_cost_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP CONSTRAINT "FK_fc32c244f7512f1c08add2ce181"`);
        await queryRunner.query(`ALTER TABLE "parcel_query" RENAME COLUMN "shippingCostId" TO "shipping_cost_id"`);
        await queryRunner.query(
            `ALTER TABLE "parcel_query" ADD CONSTRAINT "FK_901b7aed029d67a57c5785f2e6f" FOREIGN KEY ("shipping_cost_id") REFERENCES "shipping_cost_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
