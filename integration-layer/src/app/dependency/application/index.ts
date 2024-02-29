import {IApplication} from "../../interface";
import {createIntegrationApiContainer} from "./container";

export class IntegrationApiApplication implements IApplication {
    constructor(private readonly config: IntegrationApiApplication) {}
    start(): Promise<void> {
        const container = createIntegrationApiContainer()
    }

}
