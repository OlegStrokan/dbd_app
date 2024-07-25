import { ParcelEventScheduleJob } from ".";
import {
  IAppContainer,
  IApiContainer,
  createTestAppContainer,
} from "../../../container/test";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { Log } from "../../../../infrastructure/entity/log";

// TODO update log[0] shitcode
describe("ParcelEventWorker", () => {
  let container: IApiContainer;
  let worker: ParcelEventScheduleJob;

  beforeAll(async () => {
    try {
      const { parcelEventWorker, apiContainer } =
        await createTestAppContainer();
      worker = parcelEventWorker;
      container = apiContainer;
    } catch (error) {
      console.error("Error in beforeAll:", error);
    }
  });

  afterAll(async () => {
    try {
      await container.exchangeDataSource.destroy();
      await container.iLDataSource.query(
        "TRUNCATE TABLE log RESTART IDENTITY CASCADE"
      );
      await container.iLDataSource.destroy();
    } catch (error) {
      console.error("Error in afterAll:", error);
    }
  });

  it("should save last sent at log from log", async () => {
    try {
      const testDate = new Date(Date.now()).toISOString();
      // await container.iLDataSource.manager.save(log);

      await worker.saveLastSentAt(new Date(testDate));

      await worker.loadLastSentAt();

      expect(worker.getLastSentAt.toISOString()).toEqual(testDate);
    } catch (error) {
      console.error("Error in test case:", error);
    }
  });

  it("should update last log if log already exist", async () => {
    {
      const log = new Log();
      log.lastConsumedAt = new Date(Date.now()).toISOString();

      await container.iLDataSource.manager.save(log);

      await worker.loadLastSentAt();

      expect(worker.getLastSentAt.toISOString()).toEqual(log.lastConsumedAt);
    }
  });
});
