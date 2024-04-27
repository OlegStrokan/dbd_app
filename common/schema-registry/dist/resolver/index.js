"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResolver = exports.SchemaRepositoryError = void 0;
const index_1 = require("../schemas/index");
class SchemaRepositoryError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
    }
}
exports.SchemaRepositoryError = SchemaRepositoryError;
const createResolver = (schemaKey, supportedVersions) => {
    const availableVersions = index_1.SCHEMAS[schemaKey];
    const onlySupportedEntries = Object.entries(availableVersions).reduce((result, [key, value]) => {
        const availableVersion = key;
        if (!supportedVersions.includes(availableVersion)) {
            return result;
        }
        return { ...result, [key]: value };
    }, {});
    return (version) => {
        const selectedVersion = onlySupportedEntries[version];
        if (!selectedVersion) {
            throw new SchemaRepositoryError(`Schema "${String(schemaKey)}" and version "${version}" not found or not supported!`, {
                schemaKey,
                version,
                supportedVersions,
            });
        }
        return selectedVersion;
    };
};
exports.createResolver = createResolver;
//# sourceMappingURL=index.js.map