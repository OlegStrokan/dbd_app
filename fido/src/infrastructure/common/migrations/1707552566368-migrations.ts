import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1707552566368 implements MigrationInterface {
    name = 'Migrations1707552566368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel-deliveries" DROP COLUMN "parcelNumber"`);
        await queryRunner.query(`ALTER TABLE "parcel-deliveries" ADD "parcelNumber" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel-deliveries" DROP COLUMN "parcelNumber"`);
        await queryRunner.query(`ALTER TABLE "parcel-deliveries" ADD "parcelNumber" integer NOT NULL`);
    }

}
