
export type ISO8601 = string

export const toISO8601UTC = (date: Date): ISO8601 => {
    return date.toISOString();
}
