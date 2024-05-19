import {BaseError} from "../../../libs/errors";

export class ParcelDeliveryAlreadyExistError extends BaseError {
    constructor(message: string, payload: Record<string, unknown>) {
        super({ message, payload});
    }
}
