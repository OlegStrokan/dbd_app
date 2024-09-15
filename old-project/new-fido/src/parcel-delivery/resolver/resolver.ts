import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { ParcelDeliveryEntity } from "../infrastructure/entity/parcel-delivery";
import { CreateParcelDeliveryInput } from "./request-type";
import { ICreateParcelDeliveryUseCase } from "../use-cases/create-parcel-delivery/interfaces";
import { IGetParcelDeliveryUseCase } from "../use-cases/get-parcel-delivery/interfaces";
import { Inject } from "@nestjs/common";
import { CreateParcelDeliveryUseCase } from "../use-cases/create-parcel-delivery";
import { GetParcelDeliveryUseCase } from "../use-cases/get-parcel-delivery";
import { ParcelDeliveryGQL } from "./response-type";

@Resolver(() => ParcelDeliveryEntity)
export class ParcelDeliveryResolver {
  constructor(
    @Inject(CreateParcelDeliveryUseCase)
    private readonly createParcelDeliveryUseCase: ICreateParcelDeliveryUseCase,
    @Inject(GetParcelDeliveryUseCase)
    private readonly getParcelDeliveryUseCase: IGetParcelDeliveryUseCase
  ) {}

  @Query(() => [ParcelDeliveryGQL])
  async getParcelDelivery(
    @Args("getParcelDeliveryInput") id: ParcelDeliveryEntity["id"]
  ) {
    const parcelForRepayment = await this.getParcelDeliveryUseCase.getOne(id);
    return parcelForRepayment;
  }
  // mostly we won't use this methods, because we have parcel-import, but shit happens
  @Mutation(() => ParcelDeliveryEntity)
  createParcelDelivery(
    @Args("createParcelDeliveryInput")
    createParcelDeliveryInput: CreateParcelDeliveryInput
  ) {
    return this.createParcelDeliveryUseCase.create(createParcelDeliveryInput);
  }
}
