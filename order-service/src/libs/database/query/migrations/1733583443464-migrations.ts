import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733583443464 implements MigrationInterface {
    name = 'Migrations1733583443464';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "order_item_query" ("id" character varying NOT NULL, "productId" character varying NOT NULL, "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "weight" numeric(10,2) NOT NULL, "orderQueryId" character varying, CONSTRAINT "PK_d58b67c2a839ab01d2bc7f87cc5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "parcel_query" ("id" character varying NOT NULL, "trackingNumber" character varying NOT NULL, "weight" numeric NOT NULL, "dimensions" character varying NOT NULL, "orderId" character varying NOT NULL, CONSTRAINT "PK_e18968c09cb8c821671d12c6d9c" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "order_query" ("id" character varying NOT NULL, "customerId" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "orderDate" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, "deliveryAddress" character varying, "paymentMethod" character varying, "deliveryDate" TIMESTAMP, "trackingNumber" character varying, "feedback" character varying, "specialInstructions" character varying, CONSTRAINT "PK_e46d958232a76810d66e0e99104" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "order_item_query" ADD CONSTRAINT "FK_63ea8a44d88f9b09eba00dd2350" FOREIGN KEY ("orderQueryId") REFERENCES "order_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "parcel_query" ADD CONSTRAINT "FK_ccf98b06211be9f9efe25867c35" FOREIGN KEY ("orderId") REFERENCES "order_query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parcel_query" DROP CONSTRAINT "FK_ccf98b06211be9f9efe25867c35"`);
        await queryRunner.query(`ALTER TABLE "order_item_query" DROP CONSTRAINT "FK_63ea8a44d88f9b09eba00dd2350"`);
        await queryRunner.query(`DROP TABLE "order_query"`);
        await queryRunner.query(`DROP TABLE "parcel_query"`);
        await queryRunner.query(`DROP TABLE "order_item_query"`);
    }
}
