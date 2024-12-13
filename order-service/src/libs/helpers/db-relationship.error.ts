import { BaseError } from './base-error.error';

export class RelationNotLoadedError extends BaseError {
    constructor(path: string) {
        super(`Trying to access unloaded relation! The relation at: ${path} was not loaded!`, { path });
    }
}
