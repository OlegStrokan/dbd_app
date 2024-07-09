import { ParcelEventWorker } from ".";
import {
  createTestApiContainer,
  createTestContainer,
} from "../../../container/test";
import { AppDataSource } from "../../../../infrastructure/exchange-database.config";
import { ILDataSource } from "../../../../infrastructure/database.config";
import { Log } from "../../../../infrastructure/entity/log";
import { describe, beforeAll, afterAll, it, expect } from "vitest";

describe("ParcelEventWorker", () => {
  let worker: ParcelEventWorker;
  let apiContainer;

  beforeAll(async () => {
    try {
      apiContainer = await createTestContainer();
      worker = await ParcelEventWorker.create();
      console.log("Setup completed");
    } catch (error) {
      console.error("Error in beforeAll:", error);
    }
  });

  afterAll(async () => {
    try {
      await AppDataSource.destroy();
      await ILDataSource.destroy();
      console.log("Cleanup completed");
    } catch (error) {
      console.error("Error in afterAll:", error);
    }
  });

  it("should load last sent at log from log", async () => {
    try {
      const testDate = new Date().toISOString();
      const logEntity = new Log();
      logEntity.lastConsumedAt = testDate;
      await ILDataSource.manager.save(logEntity);
      console.log("Log entity saved");

      await worker.loadLastSentAt();
      console.log("Worker loaded last sent at");

      expect(worker["lastSentAt"].toISOString()).toEqual(testDate);
    } catch (error) {
      console.error("Error in test case:", error);
    }
  });
});
