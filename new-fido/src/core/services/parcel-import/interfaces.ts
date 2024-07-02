import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type";

export interface IParcelImportService {
  saveDataToDatabase(data: CreateParcelDeliveryInput[]): Promise<void>;
  consumeNatsMessages(): void;
}
