import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717250972630 implements MigrationInterface {
  name = "Migration1717250972630";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "log" ("id" character varying NOT NULL, "lastConsumedAt" character varying NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "log"`);
  }
}
