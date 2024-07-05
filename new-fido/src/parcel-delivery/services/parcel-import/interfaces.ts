import { CreateParcelDeliveryInput } from "@app/parcel-delivery/resolver/request-type";

export interface IParcelImportService {
  saveDataToDatabase(data: CreateParcelDeliveryInput[]): Promise<void>;
  consumeNatsMessages(): void;
}
