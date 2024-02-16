import {BaseError} from "../../../libs/errors";

export class ParcelDeliveryNotFoundError extends BaseError {
    constructor(message: string, payload: Record<string, unknown>) {
        super({message, payload})
    }
}
