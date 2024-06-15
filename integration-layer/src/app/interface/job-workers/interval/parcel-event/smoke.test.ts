// import { describe, it, beforeAll, afterAll, expect } from "vitest";
// import { AppDataSource } from "../../../../infrastructure/exchange-database.config";
// import { ILDataSource } from "../../../../infrastructure/database.config";
// import { ParcelEvent } from "../../../../infrastructure/entity/parcel-event/index";
// import { Log } from "../../../../infrastructure/entity/log/index";
// import { createTestContainer } from "../../../container/test/index";
// import { ParcelEventWorker } from "../parcel-event/index";
// import { NatsService } from "../../../../infrastructure/nats/index";

// describe("ParcelEventWorker", () => {
//   let worker: ParcelEventWorker;
//   let natsService: NatsService;
//   let apiContainer;
//   let jobWorkerContainer;

//   beforeAll(async () => {
//     const container = await createTestContainer();
//     apiContainer = container.apiContainer;
//     jobWorkerContainer = container.jobWorkerContainer;
//     console.log(container, "helo");
//     natsService = apiContainer.nats;
//     worker = await ParcelEventWorker.create(natsService);
//   });

//   afterAll(async () => {
//     await natsService.disconnect();
//     await AppDataSource.destroy();
//     await ILDataSource.destroy();
//   });

//   it("should load last sent at from log", async () => {
//     const logEntry = new Log();
//     logEntry.id = "uuid_is_overkill_here";
//     logEntry.lastConsumedAt = new Date().toISOString();
//     await ILDataSource.manager.save(logEntry);

//     await worker.loadLastSentAt();

//     expect(worker["lastSentAt"]).toBeInstanceOf(Date);
//   });

//   it("should save last sent at to log", async () => {
//     const newDate = new Date();
//     await worker.saveLastSentAt(newDate);

//     const logEntry = await ILDataSource.manager.findOne(Log, {
//       where: { id: "uuid_is_overkill_here" },
//     });

//     expect(logEntry.lastConsumedAt).toBe(newDate.toISOString());
//   });

//   it("should process and publish parcel events", async () => {
//     // Setup test data
//     const parcelEvent = new ParcelEvent();
//     parcelEvent.updated_at = new Date().toISOString();
//     await AppDataSource.manager.save(parcelEvent);

//     // Run cron job
//     await worker.startCronJob();

//     // Ensure the parcel event was processed and published
//     expect(worker["lastSentAt"]).toEqual(parcelEvent.updated_at);
//   });

//   it("should handle errors gracefully during cron job", async () => {
//     // Manipulate the database to cause an error
//     await AppDataSource.manager.query("DROP TABLE parcel_event");

//     // Run cron job
//     await expect(worker.startCronJob()).resolves.toBeUndefined();

//     // Recreate the table for other tests
//     await AppDataSource.synchronize(); // or any other method to recreate the table schema
//   });
// });
