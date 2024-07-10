import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720526697779 implements MigrationInterface {
  name = "Migration1720526697779";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "log" DROP CONSTRAINT "PK_350604cbdf991d5930d9e618fbd"`
    );
    await queryRunner.query(`ALTER TABLE "log" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "log" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "log" ADD CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "log" DROP CONSTRAINT "PK_350604cbdf991d5930d9e618fbd"`
    );
    await queryRunner.query(`ALTER TABLE "log" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "log" ADD "id" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "log" ADD CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id")`
    );
  }
}
