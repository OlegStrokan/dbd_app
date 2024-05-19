export const makeArray = <TResult>(
    length: number,
    factory: (index: number) => TResult
): TResult[] => Array.from({ length}, (_value, index) => factory(index))
