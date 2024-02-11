import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ParcelDeliveryRepository} from "../../../infrastructure/repositories/parcel-delivery";
import {IParcelDeliveryRepository} from "../../repositories/parcel-delivery";
import {ParcelDeliveryEntity} from "../../../infrastructure/entities/parcel-delivery";
import {IGetParcelDeliveryUseCase} from "./interfaces";

@Injectable()
export class GetParcelDeliveryUseCase implements IGetParcelDeliveryUseCase {

    constructor(
        @InjectRepository(ParcelDeliveryRepository)
        public readonly parcelDeliveryRepository: IParcelDeliveryRepository,
    ) {}

    async getOne(id: string): Promise<ParcelDeliveryEntity> {
        return await this.parcelDeliveryRepository.findOneById(id)


    }
}
