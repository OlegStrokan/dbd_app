export class BaseError {
    constructor(public readonly message: string, public readonly payload?: Record<string, unknown>) {}
}
