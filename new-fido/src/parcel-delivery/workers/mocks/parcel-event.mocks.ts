import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { DecodingDataService } from "@app/services/decoding-data/decoding-data.service";
import { ParcelDelivery } from "@app/parcel-delivery/entity";

@Injectable()
export class ParcelEventMocksService {
  constructor(private readonly decodingDataService: DecodingDataService) {}

  public createMockParcelEventBuffer(): Uint8Array {
    const parcelDelivery = ParcelDelivery.create({
      parcelNumber: faker.string.uuid(),
    });

    return this.decodingDataService.encodeEvent(parcelDelivery);
  }

  public async createMockParcelEventsArray(
    numEvents: number
  ): Promise<ParcelDelivery[]> {
    const decodedEvents: ParcelDelivery[] = [];

    for (let i = 0; i < numEvents; i++) {
      const buffer = this.createMockParcelEventBuffer();
      const decodedEvent = this.decodingDataService.decodeEvent(buffer);
      decodedEvents.push(decodedEvent);
    }

    return decodedEvents;
  }

  public createMockParcelEventBufferMap(
    numEvents: number
  ): Map<string, Uint8Array[]> {
    const bufferArray: Uint8Array[] = [];

    for (let i = 0; i < numEvents; i++) {
      bufferArray.push(this.createMockParcelEventBuffer());
    }

    const bufferMap = new Map<string, Uint8Array[]>();
    // TODO - maybe it's will be better to make some shared createMockMapData fu
    bufferMap.set("parcel-event", bufferArray);

    return bufferMap;
  }
}
