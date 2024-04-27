import { SCHEMAS } from "../schemas/index";
import avro from "avsc";
export type AvailableSchemas = typeof SCHEMAS;
export type SchemaVersions = {
    [key: string]: {
        version: number;
        schema: avro.Type;
    };
};
export type VersionResolver<T> = (version: string) => T;
export declare class SchemaRepositoryError extends Error {
    details: any;
    constructor(message: string, details: any);
}
export declare const createResolver: <TSchema extends "parcelEvent", TSupportedVersions extends (keyof {
    parcelEvent: {
        v1: {
            version: number;
            schema: avro.Type;
        };
    };
}[TSchema])[]>(schemaKey: TSchema, supportedVersions: TSupportedVersions) => VersionResolver<any>;
