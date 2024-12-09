import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733672995430 implements MigrationInterface {
    name = 'Migrations1733672995430';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "order_projection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "status" character varying, "shippedAt" TIMESTAMP, "deliveredAt" TIMESTAMP, "items" json, CONSTRAINT "PK_61de7c3350b32cb2ba8f45b9f6f" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_projection"`);
    }
}
