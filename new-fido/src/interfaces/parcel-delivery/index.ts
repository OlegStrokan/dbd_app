// import {Resolver, Mutation, Args, Query} from '@nestjs/graphql';
import { ParcelDeliveryEntity } from '../../infrastructure/entities/parcel-delivery';
import { CreateParcelDeliveryInput } from './request-type/create-parcel-delivery.input';
import { ICreateParcelDeliveryUseCase } from '../../core/use-cases/create-parcel-delivery/interfaces';
import { IGetParcelDeliveryUseCase } from '../../core/use-cases/get-parcel-delivery/interfaces';
import { Inject } from '@nestjs/common';
import { CreateParcelDeliveryUseCase } from '../../core/use-cases/create-parcel-delivery';
import { GetParcelDeliveryUseCase } from '../../core/use-cases/get-parcel-delivery';

// @Resolver(() => ParcelDeliveryEntity)
export class ParcelDeliveryResolver {
  constructor(
    @Inject(CreateParcelDeliveryUseCase)
    private readonly createParcelDeliveryUseCase: ICreateParcelDeliveryUseCase,
    @Inject(GetParcelDeliveryUseCase)
    private readonly getParcelDeliveryUseCase: IGetParcelDeliveryUseCase,
  ) {}

  // @Query(() => [ParcelDeliveryEntity])
  getParcelDelivery(
    /*@Args('getParcelDeliveryInput')*/ id: ParcelDeliveryEntity['id'],
  ) {
    return this.getParcelDeliveryUseCase.getOne(id);
  }

  // @Mutation(() => ParcelDeliveryEntity)
  createParcelDelivery(
    /*@Args('createParcelDeliveryInput')*/ createParcelDeliveryInput: CreateParcelDeliveryInput,
  ) {
    return this.createParcelDeliveryUseCase.create(createParcelDeliveryInput);
  }
}
