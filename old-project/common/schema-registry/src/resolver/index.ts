import { SCHEMAS } from "../schemas/index";
import avro from "avsc";

export type AvailableSchemas = typeof SCHEMAS;

export type SchemaVersions = {
  [key: string]: { version: number; schema: avro.Type };
};
export type VersionResolver<T> = (version: string) => T;

export class SchemaRepositoryError extends Error {
  constructor(message: string, public details: any) {
    super(message);
  }
}

export const createResolver = <
  TSchema extends keyof AvailableSchemas,
  TSupportedVersions extends (keyof AvailableSchemas[TSchema])[]
>(
  schemaKey: TSchema,
  supportedVersions: TSupportedVersions
): VersionResolver<any> => {
  const availableVersions: SchemaVersions = SCHEMAS[schemaKey];

  const onlySupportedEntries = Object.entries(availableVersions).reduce(
    (result, [key, value]) => {
      const availableVersion = key as keyof AvailableSchemas[TSchema];

      if (!supportedVersions.includes(availableVersion)) {
        return result;
      }

      return { ...result, [key]: value };
    },
    {} as SchemaVersions
  );

  return (version: string) => {
    const selectedVersion = onlySupportedEntries[version];

    if (!selectedVersion) {
      throw new SchemaRepositoryError(
        `Schema "${String(
          schemaKey
        )}" and version "${version}" not found or not supported!`,
        {
          schemaKey,
          version,
          supportedVersions,
        }
      );
    }

    return selectedVersion as AvailableSchemas[TSchema][TSupportedVersions[number]];
  };
};
