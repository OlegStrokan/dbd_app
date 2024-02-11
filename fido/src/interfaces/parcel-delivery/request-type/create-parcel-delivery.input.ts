import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateParcelDeliveryInput {
  @Field(() => String, { description: 'Example field (placeholder)' })
  name: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  parcelNumber: string;
}
