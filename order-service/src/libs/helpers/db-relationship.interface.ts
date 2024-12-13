/**
 * These relation helpers are here to provide maximum flexibility for the storage medium of the application entities.
 * The relations are possibly "not loaded" at all times and will require the storage medium to provide the relation data if used.
 *
 * A runtime error will be thrown if the relation data are not available when accessed.
 * This will prompt the developer to make sure the data is available via the storage repository.
 */

import { RelationNotLoadedError } from './db-relationship.error';

type Id = string | number;

export type EntityLike<T> = {
    id?: Id;
    clone(): T;
};

export class HasOne<T extends EntityLike<T>> {
    private constructor(
        private readonly errPath: string,
        private readonly entity: T | null,
        private readonly id?: T['id']
    ) {}

    static unloaded<T extends EntityLike<T>>(path: string, id?: T['id']) {
        return new HasOne<T>(path, null, id);
    }

    static loaded<T extends EntityLike<T>>(path: string, entity: T) {
        return new HasOne<T>(path, entity, entity.id);
    }

    hasId = () => Boolean(this.id);

    isLoaded = () => Boolean(this.entity);

    getId = (): T['id'] => {
        if (!this.id) throw new RelationNotLoadedError(this.errPath);

        return this.id;
    };

    get = (): Readonly<T> => {
        if (!this.isLoaded()) throw new RelationNotLoadedError(this.errPath);

        return this.entity as T;
    };
}

export class HasMany<T extends EntityLike<T>> {
    private constructor(private readonly entities: Readonly<T>[] | null, private readonly path: string) {}

    /**
     * @deprecated use `HasMany.loaded([], path)` instead
     */
    static empty(path: string) {
        return new HasMany<never>([], path);
    }

    static unloaded(path: string) {
        return new HasMany<never>(null, path);
    }

    static loaded<T extends EntityLike<T>>(entities: T[], path: string) {
        return new HasMany<T>(entities, path);
    }

    isLoaded = () => Boolean(this.entities);

    get = (): Readonly<T[]> => {
        if (!this.isLoaded()) throw new RelationNotLoadedError(this.path);

        return this.entities as T[];
    };
}
