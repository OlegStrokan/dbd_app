import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";

export interface IParcelImportService {
  saveDataToDatabase(data: CreateParcelDeliveryInput[]): Promise<void>;
  consumeNatsMessages(): void;
}
