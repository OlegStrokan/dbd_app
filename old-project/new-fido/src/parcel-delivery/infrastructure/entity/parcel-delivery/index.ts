import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ParcelDelivery } from "../../../entity";

@ObjectType()
@Entity({ name: "parcel-delivery" })
export class ParcelDeliveryEntity {
  @Field(() => String, { description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, { description: "Parcel number" })
  @Column()
  parcelNumber: string;
}
