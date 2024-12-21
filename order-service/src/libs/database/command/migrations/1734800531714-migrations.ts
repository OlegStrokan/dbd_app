import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734800531714 implements MigrationInterface {
    name = 'Migrations1734800531714';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "shipping_cost_command" ("id" character varying NOT NULL, "orderId" character varying NOT NULL, "weight" double precision NOT NULL, "dimensions" json NOT NULL, "shippingOptions" json NOT NULL, "calculatedCost" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_015a60b6828bf2aa4d7a881b5e3" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "parcel_command" ADD "shippingCostId" character varying`);
        await queryRunner.query(
            `ALTER TABLE "parcel_command" ADD CONSTRAINT "FK_41eb78d2fcad9243fa67292a875" FOREIGN KEY ("shippingCostId") REFERENCES "shipping_cost_command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_command" DROP CONSTRAINT "FK_41eb78d2fcad9243fa67292a875"`);
        await queryRunner.query(`ALTER TABLE "parcel_command" DROP COLUMN "shippingCostId"`);
        await queryRunner.query(`DROP TABLE "shipping_cost_command"`);
    }
}
