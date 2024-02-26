import {BaseError} from "../../../libs/errors";


export class ImportManagerSaveError extends BaseError {
    constructor(message: string, payload: Record<string, unknown>) {
        super({message, payload})
    }
}
