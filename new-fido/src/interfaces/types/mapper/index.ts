export interface IMapper<GQL, Core, DB> {
  toCoreEntity(dbEntity: DB): Core;
  toGQLEntity(coreEntity: Core): GQL;
}
