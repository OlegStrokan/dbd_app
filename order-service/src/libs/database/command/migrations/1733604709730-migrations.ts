import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733604709730 implements MigrationInterface {
    name = 'Migrations1733604709730';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_command" ADD "parcelId" character varying`);
        await queryRunner.query(
            `ALTER TABLE "order_item_command" ADD CONSTRAINT "FK_26b2807557a9a52d5faa79c92a5" FOREIGN KEY ("parcelId") REFERENCES "parcel_command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP CONSTRAINT "FK_26b2807557a9a52d5faa79c92a5"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP COLUMN "parcelId"`);
    }
}
