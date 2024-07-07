export interface IBufferToDbService {
  consumeNatsMessages(): Promise<void>;
  onModuleDestroy(): Promise<void>;
}
