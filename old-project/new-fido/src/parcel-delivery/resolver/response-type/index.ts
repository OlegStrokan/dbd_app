import { Field, ObjectType } from "@nestjs/graphql";
import { PaginatedResponse } from "../../../shared/interfaces/schema-types/pagination/response-type";

@ObjectType()
export class ParcelDeliveryGQL {
  @Field(() => String, { description: "Unique identifier" })
  id: string;
  @Field(() => String, { description: "Parcel Number" })
  parcelNumber: string;
}
@ObjectType()
export class ParcelDeliveryResponse extends PaginatedResponse(
  ParcelDeliveryGQL
) {}
