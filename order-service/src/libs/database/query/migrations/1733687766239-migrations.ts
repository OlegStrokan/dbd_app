import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1733687766239 implements MigrationInterface {
    name = 'Migrations1733687766239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_projection" ADD "deliveryDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order_projection" ADD "deliveryAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_projection" DROP COLUMN "deliveryAddress"`);
        await queryRunner.query(`ALTER TABLE "order_projection" DROP COLUMN "deliveryDate"`);
    }

}
