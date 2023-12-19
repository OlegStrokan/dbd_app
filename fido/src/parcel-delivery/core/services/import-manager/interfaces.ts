import {CreateParcelDeliveryInput} from "../../use-cases/create-parcel-delivery/dto/create-parcel-delivery.input";

export interface IImportManagerService  {
    fetchDataAndSaveToDb(): Promise<void>,
    saveDataToDatabase(data: CreateParcelDeliveryInput[]): Promise<void>
}
