interface IBaseErrorDescription<TPayload> {
    message: string;
    payload?: TPayload;
}

export class BaseError<TPayload extends Record<string, unknown> = Record<string, unknown>> extends Error {
    readonly payload: TPayload | null;
    readonly fingerprint: string | undefined;

    constructor(errorDescription: IBaseErrorDescription<TPayload>) {
        super(errorDescription.message);
        this.name = this.constructor.name;
        this.payload = errorDescription.payload || null;
    }
}
