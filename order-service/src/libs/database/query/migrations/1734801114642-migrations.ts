import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734801114642 implements MigrationInterface {
    name = 'Migrations1734801114642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP CONSTRAINT "FK_fc32c244f7512f1c08add2ce181"`);
        await queryRunner.query(`ALTER TABLE "parcel_query" ALTER COLUMN "shippingCostId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parcel_query" ADD CONSTRAINT "FK_fc32c244f7512f1c08add2ce181" FOREIGN KEY ("shippingCostId") REFERENCES "shipping_cost_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP CONSTRAINT "FK_fc32c244f7512f1c08add2ce181"`);
        await queryRunner.query(`ALTER TABLE "parcel_query" ALTER COLUMN "shippingCostId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "parcel_query" ADD CONSTRAINT "FK_fc32c244f7512f1c08add2ce181" FOREIGN KEY ("shippingCostId") REFERENCES "shipping_cost_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
