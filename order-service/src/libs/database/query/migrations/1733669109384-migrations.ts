import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1733669109384 implements MigrationInterface {
    name = 'Migrations1733669109384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP CONSTRAINT "FK_ccf98b06211be9f9efe25867c35"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" ADD CONSTRAINT "FK_ccf98b06211be9f9efe25867c35" FOREIGN KEY ("orderId") REFERENCES "order_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
