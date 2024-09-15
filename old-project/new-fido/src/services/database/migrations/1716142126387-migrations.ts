import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1716142126387 implements MigrationInterface {
    name = 'Migrations1716142126387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "action-logger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "details" character varying, "parentActionId" character varying(255) NOT NULL, "authorId" character varying(255) NOT NULL, "authorEmail" character varying(255) NOT NULL, "timestamp" character varying(255) NOT NULL, CONSTRAINT "PK_1097cd1ad7325e822e08a35eaed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c2f46fd150c5892fb5bdbb732" ON "action-logger" ("timestamp") `);
        await queryRunner.query(`CREATE INDEX "IDX_b379ea23d185be6c39a3a2a836" ON "action-logger" ("authorEmail") `);
        await queryRunner.query(`CREATE INDEX "IDX_0e78153b4d5e90455088b19266" ON "action-logger" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c72a6155b20b96991a1bb910ff" ON "action-logger" ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_72182dd527b33e30a3918c275e" ON "action-logger" ("name") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_72182dd527b33e30a3918c275e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c72a6155b20b96991a1bb910ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e78153b4d5e90455088b19266"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b379ea23d185be6c39a3a2a836"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c2f46fd150c5892fb5bdbb732"`);
        await queryRunner.query(`DROP TABLE "action-logger"`);
    }

}
