import { AppDataSource } from "../../infrastructure/database.config";
import { ParcelEvent } from "../../infrastructure/entity/parcel-event/index";
import * as cron from "node-cron";

export class ParcelEventWorker {
  async start() {
    try {
      cron.schedule("* * * * * *", async () => {
        await this.createParcelEvent();
      });
    } catch (e) {
      console.log("Error starting worker", e);
    }
  }

  async createParcelEvent() {
    const parcelEvent = new ParcelEvent();
    console.log("Creating parcel event");
    parcelEvent.id = Math.floor(Math.random() * 1000000).toString();
    parcelEvent.parcelNumber = Math.floor(Math.random() * 1000000).toString();
    parcelEvent.createdAt = new Date().toISOString();
    parcelEvent.updatedAt = new Date().toISOString();
    parcelEvent.weight = parseFloat((Math.random() * 1000).toFixed(2));
    try {
      await AppDataSource.manager.save(parcelEvent);
    } catch (error) {
      console.log("Error saving parcel event", error);
    }
    console.log("Parcel event created", parcelEvent);
  }
}
