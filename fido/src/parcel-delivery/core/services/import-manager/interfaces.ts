import {CreateParcelDeliveryInput} from "../../../interfaces/parcel-delivery/request-type/create-parcel-delivery.input";

export interface IImportManagerService  {
    fetchDataAndSaveToDb(): Promise<void>,
    saveDataToDatabase(data: CreateParcelDeliveryInput[]): Promise<void>
}
