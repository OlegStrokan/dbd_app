import { MessageBufferService } from "@app/services/message-buffer/message-buffer.service";
import { ParcelEventWorker } from "./parcel-event.worker";
import { ParcelDeliveryRepository } from "../infrastructure/repository/parcel-delivery";
import { DecodingDataService } from "@app/services/decoding-data/decoding-data.service";
import { JetStreamService } from "@app/services/jet-stream/jet-stream.service";
import { TestingModule } from "@nestjs/testing";
import { createDbTestingModule } from "@app/services/database/create-db-module";
import { clearRepos } from "@app/shared/tools/configs/clear.config";
import { ParcelEventMocksService } from "./mocks/parcel-event.mocks";

describe("Parcel event worker tests", () => {
  let parcelEventWorker: ParcelEventWorker;
  let messageBufferService: MessageBufferService;
  let parcelRepository: ParcelDeliveryRepository;
  let decodeService: DecodingDataService;
  let jetStreamService: JetStreamService;
  let parcelEventMocksService: ParcelEventMocksService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createDbTestingModule();

    parcelRepository = module.get<ParcelDeliveryRepository>(
      ParcelDeliveryRepository
    );
    decodeService = module.get<DecodingDataService>(DecodingDataService);
    jetStreamService = module.get<JetStreamService>(JetStreamService);
    parcelEventMocksService = new ParcelEventMocksService(decodeService);
    messageBufferService = {
      getMessageBuffer: jest.fn(),
      clearMessageBuffer: jest.fn(),
    } as unknown as MessageBufferService;

    parcelEventWorker = new ParcelEventWorker(
      jetStreamService,
      messageBufferService,
      parcelRepository,
      decodeService
    );
  });

  beforeEach(async () => {
    await clearRepos(module);
  });

  afterAll(async () => {
    await clearRepos(module);
    await module.close();
  });

  it("should save all parcels from message buffer to database", async () => {
    const mockParcelEvents =
      await parcelEventMocksService.createMockParcelEventsArray(5);
    const mockBuffers =
      parcelEventMocksService.createMockParcelEventBufferMap(5);

    jest
      .spyOn(messageBufferService, "getMessageBuffer")
      .mockResolvedValue(mockBuffers.get("parcel-event") || []);
    jest
      .spyOn(messageBufferService, "clearMessageBuffer")
      .mockImplementation(() => {});

    jest
      .spyOn(decodeService, "decodeEvent")
      .mockImplementation((buffer: Uint8Array) => {
        return (
          mockParcelEvents.find(
            (event) => decodeService.encodeEvent(event) === buffer
          ) || ({} as any)
        );
      });

    jest
      .spyOn(parcelRepository, "upsertMany")
      .mockResolvedValue(mockParcelEvents);

    await parcelEventWorker.consumeNatsMessages();

    expect(messageBufferService.getMessageBuffer).toHaveBeenCalled();
    expect(parcelRepository.upsertMany).toHaveBeenCalledWith(mockParcelEvents);
    expect(messageBufferService.clearMessageBuffer).toHaveBeenCalled();
  });
});
