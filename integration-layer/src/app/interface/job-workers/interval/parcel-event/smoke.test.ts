import { ParcelEventWorker } from ".";
import {
  IAppContainer,
  IApiContainer,
  createTestAppContainer,
} from "../../../container/test";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { IJobWorkerContainer } from "../../../container/job-worker";
import { WORKER } from "../../../container/job-worker/register";
import { Log } from "../../../../infrastructure/entity/log";

describe("ParcelEventWorker", () => {
  let container: IApiContainer;
  let worker: ParcelEventWorker;

  beforeAll(async () => {
    try {
      const { parcelEventWorker, apiContainer } =
        await createTestAppContainer();
      worker = parcelEventWorker;
      container = apiContainer;
      console.log("Setup completed");
    } catch (error) {
      console.error("Error in beforeAll:", error);
    }
  });

  afterAll(async () => {
    try {
      await container.exchangeDataSource.destroy(),
        await container.iLDataSource.destroy();
      console.log("Cleanup completed");
    } catch (error) {
      console.error("Error in afterAll:", error);
    }
  });

  it("should load last sent at log from log", async () => {
    try {
      const log = new Log();
      log.lastConsumedAt = new Date(Date.now()).toISOString();
      await container.iLDataSource.manager.save(log);
      const lastLog = await container.iLDataSource.manager.find(Log, {
        order: {
          id: "DESC",
        },
        take: 1,
      });
      await worker.loadLastSentAt();
      console.log("Worker loaded last sent at");

      expect(worker.getLastSentAt.toISOString()).toEqual(
        lastLog[0].lastConsumedAt
      );
    } catch (error) {
      console.error("Error in test case:", error);
    }
  });
});
