import { getRepository, Repository } from "typeorm";
import { ParcelEvent } from "../../entities/parcel-event";

export class ParcelRepository {
  private repository: Repository<ParcelEvent>;

  constructor() {
    this.repository = getRepository(ParcelEvent);
  }

  create(parcel: ParcelEvent) {
    const createdParcel = this.repository.create(parcel);
    return this.repository.save(createdParcel);
  }
}
