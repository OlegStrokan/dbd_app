import {Key} from "../../typescript";


export const selectRandom = <TValue>(obj: Record<Key, TValue> | ArrayLike<TValue>): TValue => {
    const values = Object.values(obj)

    if (values.length === 0) throw new TypeError('Cannon choose random value from an empty object')

    const idx = Math.round(Math.random() * (values.length - 1))

    return values[idx]

}
