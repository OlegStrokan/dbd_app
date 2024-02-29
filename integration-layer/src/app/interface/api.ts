import Fastify, {FastifyServerOptions} from "fastify";
import {IntegrationApiContainer} from "../dependency/application/container/inteface";

export const createIntegrationApiInterface = (
    serverOptions: FastifyServerOptions,
    container: IntegrationApiContainer,
) => {
    const app = Fastify(serverOptions)

    return app
}
