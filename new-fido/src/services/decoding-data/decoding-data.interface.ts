export interface IDecodingDataService<T> {
  decodeEvent(buffer: Uint8Array): T;
}
