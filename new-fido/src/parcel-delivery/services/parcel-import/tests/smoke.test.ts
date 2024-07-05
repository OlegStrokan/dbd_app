import { TestingModule } from "@nestjs/testing";
import { createDbTestingModule } from "../../../../services/database/create-db-module";
import { ParcelDeliveryRepository } from "../../../infrastructure/repository/parcel-delivery";
import * as fs from "fs";
import { IParcelImportService } from "../interfaces";
import { IParcelDeliveryRepository } from "../../../repository";
import { ParcelImportService } from "../index";
import { SchedulerRegistry } from "@nestjs/schedule";
import { clearRepos } from "../../../../shared/tools/configs/clear.config";

describe("ImportDataService", () => {});
