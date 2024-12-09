import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733604719391 implements MigrationInterface {
    name = 'Migrations1733604719391';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_query" ADD "parcelId" character varying`);
        await queryRunner.query(
            `ALTER TABLE "order_item_query" ADD CONSTRAINT "FK_01a5fd85f311bb77480a998b731" FOREIGN KEY ("parcelId") REFERENCES "parcel_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_query" DROP CONSTRAINT "FK_01a5fd85f311bb77480a998b731"`);
        await queryRunner.query(`ALTER TABLE "order_item_query" DROP COLUMN "parcelId"`);
    }
}
