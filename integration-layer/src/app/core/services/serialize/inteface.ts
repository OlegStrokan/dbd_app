export interface ISerializeService {
    serialize(data: any): Buffer
    serialize<T>(data: Buffer): T
}
