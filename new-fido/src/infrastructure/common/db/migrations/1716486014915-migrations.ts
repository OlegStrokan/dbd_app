import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1716486014915 implements MigrationInterface {
    name = 'Migrations1716486014915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel-delivery" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel-delivery" ADD "name" character varying NOT NULL`);
    }

}
