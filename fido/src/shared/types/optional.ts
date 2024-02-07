export type Optional<TObject, Tkeys extends keyof TObject> = Omit<TObject, Tkeys> & Partial<TObject>
