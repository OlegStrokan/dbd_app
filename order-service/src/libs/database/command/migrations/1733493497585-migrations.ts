import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733493497585 implements MigrationInterface {
    name = 'Migrations1733493497585';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "order_item_command" ("id" SERIAL NOT NULL, "productId" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "orderCommandId" integer, CONSTRAINT "PK_78bddba14222b50776a2bd8f463" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "order-command" ("id" SERIAL NOT NULL, "customerId" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "orderDate" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "deliveryAddress" character varying, "paymentMethod" character varying, "specialInstructions" character varying, CONSTRAINT "PK_6804a8046042594cab78367856c" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "order_item_command" ADD CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747" FOREIGN KEY ("orderCommandId") REFERENCES "order-command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747"`);
        await queryRunner.query(`DROP TABLE "order-command"`);
        await queryRunner.query(`DROP TABLE "order_item_command"`);
    }
}
