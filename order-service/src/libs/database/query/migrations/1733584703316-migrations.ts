import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733584703316 implements MigrationInterface {
    name = 'Migrations1733584703316';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_query" DROP COLUMN "orderDate"`);
        await queryRunner.query(`ALTER TABLE "order_item_query" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_item_query" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "parcel_query" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "parcel_query" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_query" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_query" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_query" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "order_query" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "order_item_query" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "order_item_query" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "order_query" ADD "orderDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }
}
