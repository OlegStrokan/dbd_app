import { BaseError } from "../../../shared/libs/errors";

export class ParcelDeliveryAlreadyExistError extends BaseError {
  constructor(message: string, payload: Record<string, unknown>) {
    super({ message, payload });
  }
}
