import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ParcelDeliveryEntity } from "../../infrastructure/entities/parcel-delivery";
import { CreateParcelDeliveryUseCase } from "../../core/use-cases/create-parcel-delivery";
import {CreateParcelDeliveryInput} from "./request-type/create-parcel-delivery.input";

@Resolver(() => ParcelDeliveryEntity)
export class Index {
  constructor(private readonly parcelDeliveryService: CreateParcelDeliveryUseCase) {}

  @Mutation(() => ParcelDeliveryEntity)
  createParcelDelivery(@Args('createParcelDeliveryInput') createParcelDeliveryInput: CreateParcelDeliveryInput) {
    return this.parcelDeliveryService.create(createParcelDeliveryInput);
  }
}
