import { ParcelEvent } from "../../infrastructure/entities/parcel-event";
import { ParcelRepository } from "../../infrastructure/repositories/parcel-event";
import { getRepository, Repository } from "typeorm";

export class ParcelService {
  private repository: ParcelRepository;

  constructor() {
    this.repository = new ParcelRepository();
  }

  create(parcel: ParcelEvent) {
    return this.repository.create(parcel);
  }
}
