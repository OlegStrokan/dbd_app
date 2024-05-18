import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716039256988 implements MigrationInterface {
  name = "Migration1716039256988";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PARCEL_EVENT" ADD "weight" double precision NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "PARCEL_EVENT" DROP COLUMN "weight"`);
  }
}
