import { TestingModule } from "@nestjs/testing";
import { createDbTestingModule } from "../../../../infrastructure/common/db/create-db-module";
import { ParcelDeliveryRepository } from "../../../../infrastructure/repositories/parcel-delivery";
import * as fs from "fs";
import { IParcelImportService } from "../interfaces";
import { IParcelDeliveryRepository } from "../../../repositories/parcel-delivery";
import { ParcelImportService } from "../index";
import { SchedulerRegistry } from "@nestjs/schedule";
import { clearRepos } from "../../../../infrastructure/common/config/clear.config";

describe("ImportDataService", () => {});
