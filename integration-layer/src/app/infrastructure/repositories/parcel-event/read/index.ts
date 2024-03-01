import {IParcelEventReadParam, IParcelEventReadRepository} from "../../../../core/repositories/parcel-event/read";
import {IClearableRepository} from "../../../../core/repositories/clearable";
import {IParcelEventRead} from "../../../../core/entities/parcel-event";
import { EntityManager, In, MoreThan, Repository } from 'typeorm'
import {ScrollParams} from "../../../../core/types/pagination";
import {ParcelEventEntity} from "../../../entities/parcel-event";
import {toCoreParcelEvent} from "./mapper";

export class ParcelEventReadRepository
    implements IParcelEventReadRepository, IClearableRepository
{

    protected readonly parcelEventReadRepository: Repository<ParcelEventEntity>


    constructor(
        entityManager: EntityManager
    ) {
        this.parcelEventReadRepository = entityManager.getRepository(ParcelEventEntity)
    }

     async getManyByParams(
        { parcelNumbers }: IParcelEventReadParam,
        { limit, offset}: ScrollParams
    ): Promise<IParcelEventRead[]> {
        const result = await this.parcelEventReadRepository.find({
            where: {
            ...(parcelNumbers && { dataKey: In(parcelNumbers)}),
                id: MoreThan(offset)
            },
            take: limit,
            order: {
                id: 'ASC'
            }
        })
         return result.map(toCoreParcelEvent)

    }

    async clear(): Promise<void> {
        await this.parcelEventReadRepository.clear();
    }
}
