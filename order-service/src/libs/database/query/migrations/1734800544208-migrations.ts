import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734800544208 implements MigrationInterface {
    name = 'Migrations1734800544208';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "shipping_cost_query" ("id" character varying NOT NULL, "orderId" character varying NOT NULL, "calculatedCost" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7890def2f077134c87cea5b055a" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "parcel_query" ADD "shipping_cost_id" character varying NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "parcel_query" ADD CONSTRAINT "FK_901b7aed029d67a57c5785f2e6f" FOREIGN KEY ("shipping_cost_id") REFERENCES "shipping_cost_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP CONSTRAINT "FK_901b7aed029d67a57c5785f2e6f"`);
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP COLUMN "shipping_cost_id"`);
        await queryRunner.query(`DROP TABLE "shipping_cost_query"`);
    }
}
