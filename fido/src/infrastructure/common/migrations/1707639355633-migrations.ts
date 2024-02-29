import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1707639355633 implements MigrationInterface {
    name = 'Migrations1707639355633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parcel-delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parcelNumber" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_46f0797ce88b2eb338e65f4aba0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "parcel-delivery"`);
    }

}
