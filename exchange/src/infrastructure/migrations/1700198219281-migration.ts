import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1700198219281 implements MigrationInterface {
  name = "Migration1700198219281";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "parcel_event" (
        "id" varchar PRIMARY KEY NOT NULL,
        "parcelNumber" varchar NOT NULL,
        "createdAt" varchar NOT NULL,
        "updatedAt" varchar NOT NULL
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "parcel_event"`);
  }
}
