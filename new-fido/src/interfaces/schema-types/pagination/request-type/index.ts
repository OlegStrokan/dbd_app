import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class Pagination {
    @Field(() => Int)
    offset: number;

    @Field(() => Int)
    limit: number
}

@ArgsType()
export class PaginationArgs {
    @Field(() => Pagination, {
        nullable: true,
        defaultValue: {
            offset: 0,
            limit: 10
        }
    }),
    pagination: Pagination
}