import { CreateParcelDeliveryInput } from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";

export interface IParcelImportService {
  fetchDataAndSaveToDb(): Promise<void>;
  saveDataToDatabase(data: CreateParcelDeliveryInput[]): Promise<void>;
  consumeNatsMessages(): Promise<void>;
}
