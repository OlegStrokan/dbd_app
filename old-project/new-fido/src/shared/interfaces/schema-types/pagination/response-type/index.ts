import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";

export const PaginatedResponse = <TItem extends object>(
  TItemClass: Type<TItem>
) => {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    items: TItem[];

    @Field(() => Int)
    total: number;
  }

  return PaginatedResponseClass;
};
