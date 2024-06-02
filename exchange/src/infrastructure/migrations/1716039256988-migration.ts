import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716039256988 implements MigrationInterface {
  name = "Migration1716039256988";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "parcel_event" ADD "weight" double precision NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "parcel_event" DROP COLUMN "weight"`);
  }
}
