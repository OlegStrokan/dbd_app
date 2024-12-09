import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733582840997 implements MigrationInterface {
    name = 'Migrations1733582840997';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "order_item_command" ("id" character varying NOT NULL, "productId" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "weight" numeric(10,2) NOT NULL, "orderCommandId" character varying, CONSTRAINT "PK_78bddba14222b50776a2bd8f463" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "parcel_command" ("id" character varying NOT NULL, "trackingNumber" character varying NOT NULL, "weight" numeric NOT NULL, "dimensions" character varying NOT NULL, "orderId" character varying NOT NULL, CONSTRAINT "PK_821ca38a3b0013915d8ef5c5259" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "order_command" ("id" character varying NOT NULL, "customerId" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "orderDate" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "deliveryAddress" character varying, "paymentMethod" character varying, "specialInstructions" character varying, CONSTRAINT "PK_3bee31b277a792d403c5508f064" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "order_item_command" ADD CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747" FOREIGN KEY ("orderCommandId") REFERENCES "order_command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "parcel_command" ADD CONSTRAINT "FK_c587d6eaa7fc597dfee7ed55266" FOREIGN KEY ("orderId") REFERENCES "order_command"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_command" DROP CONSTRAINT "FK_c587d6eaa7fc597dfee7ed55266"`);
        await queryRunner.query(`ALTER TABLE "order_item_command" DROP CONSTRAINT "FK_f669ddae1bfe8be4af1ab62e747"`);
        await queryRunner.query(`DROP TABLE "order_command"`);
        await queryRunner.query(`DROP TABLE "parcel_command"`);
        await queryRunner.query(`DROP TABLE "order_item_command"`);
    }
}
