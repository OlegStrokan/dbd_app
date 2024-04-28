import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714226921452 implements MigrationInterface {
  name = "Migration1714226921452";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PARCEL_EVENT" ADD "weight" double precision NOT NULL DEFAULT 0`
    );
    await queryRunner.query(
      `ALTER TABLE "PARCEL_EVENT" ALTER COLUMN "weight" DROP DEFAULT`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "PARCEL_EVENT" DROP COLUMN "weight"`);
  }
}
