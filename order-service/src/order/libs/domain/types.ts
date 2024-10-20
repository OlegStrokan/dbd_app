export type Ulid = string;

export type Optional<TObject, TKeys extends keyof TObject> = Omit<TObject, TKeys> & Partial<TObject>;
