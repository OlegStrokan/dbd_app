import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1702323139053 implements MigrationInterface {
    name = 'Migrations1702323139053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parcel-deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "parcelNumber" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9ea7c1ad70a4d1dd88469e853c8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "parcel-deliveries"`);
    }

}
