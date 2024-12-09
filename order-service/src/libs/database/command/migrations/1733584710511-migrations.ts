import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733584710511 implements MigrationInterface {
    name = 'Migrations1733584710511';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_command" DROP COLUMN "orderDate"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_item_command" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "parcel_command" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "parcel_command" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_command" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_command" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_command" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "order_command" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "parcel_command" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "parcel_command" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "order_command" ADD "orderDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }
}
