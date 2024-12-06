import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733495022234 implements MigrationInterface {
    name = 'Migrations1733495022234';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP CONSTRAINT "PK_78bddba14222b50776a2bd8f463"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" ADD "id" character varying NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "order_item_command" ADD CONSTRAINT "PK_78bddba14222b50776a2bd8f463" PRIMARY KEY ("id")`
        );
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP COLUMN "orderCommandId"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" ADD "orderCommandId" character varying`);
        await queryRunner.query(`ALTER TABLE "order-command" DROP CONSTRAINT "PK_6804a8046042594cab78367856c"`);
        await queryRunner.query(`ALTER TABLE "order-command" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order-command" ADD "id" character varying NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "order-command" ADD CONSTRAINT "PK_6804a8046042594cab78367856c" PRIMARY KEY ("id")`
        );
        await queryRunner.query(
            `ALTER TABLE "order_item_command" ADD CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747" FOREIGN KEY ("orderCommandId") REFERENCES "order-command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747"`);
        await queryRunner.query(`ALTER TABLE "order-command" DROP CONSTRAINT "PK_6804a8046042594cab78367856c"`);
        await queryRunner.query(`ALTER TABLE "order-command" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order-command" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "order-command" ADD CONSTRAINT "PK_6804a8046042594cab78367856c" PRIMARY KEY ("id")`
        );
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP COLUMN "orderCommandId"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" ADD "orderCommandId" integer`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP CONSTRAINT "PK_78bddba14222b50776a2bd8f463"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "order_item_command" ADD CONSTRAINT "PK_78bddba14222b50776a2bd8f463" PRIMARY KEY ("id")`
        );
        await queryRunner.query(
            `ALTER TABLE "order_item_command" ADD CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747" FOREIGN KEY ("orderCommandId") REFERENCES "order-command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
