import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1733673961588 implements MigrationInterface {
    name = 'Migrations1733673961588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_projection" DROP CONSTRAINT "PK_61de7c3350b32cb2ba8f45b9f6f"`);
        await queryRunner.query(`ALTER TABLE "order_projection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order_projection" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_projection" ADD CONSTRAINT "PK_61de7c3350b32cb2ba8f45b9f6f" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_projection" DROP CONSTRAINT "PK_61de7c3350b32cb2ba8f45b9f6f"`);
        await queryRunner.query(`ALTER TABLE "order_projection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order_projection" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "order_projection" ADD CONSTRAINT "PK_61de7c3350b32cb2ba8f45b9f6f" PRIMARY KEY ("id")`);
    }

}
