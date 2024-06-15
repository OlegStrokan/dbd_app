import { connect, NatsConnection, Subscription } from "nats";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";
import { NatsService } from ".";

vi.mock("nats");

describe("NatsService", () => {
  let natsService: NatsService;
  let mockConnection: Partial<NatsConnection>;

  beforeEach(() => {
    natsService = new NatsService();
    mockConnection = {
      subscribe: vi.fn(),
      close: vi.fn(),
      drain: vi.fn(),
    };
    // TODO update any with global vi object
    (connect as any).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should connect to NATS server", async () => {
    await natsService.connect("nats://localhost:4222");
    expect(natsService.getConnection).toBe(mockConnection);
  });

  it("should throw an error if subscribing without connection", async () => {
    await expect(natsService.subscribe("test.subject")).rejects.toThrow(
      "Must connect to NATS server before subscribing to a subject"
    );
  });

  it("should subscribe to a subject after connecting", async () => {
    await natsService.connect("nats://localhost:4222");
    await natsService.subscribe("test.subject");
    expect(mockConnection.subscribe).toHaveBeenCalledWith("test.subject");
  });

  it("should disconnect from NATS server", async () => {
    const mockSubscription: Partial<Subscription> = {
      drain: vi.fn().mockResolvedValue(undefined),
    };
    mockConnection.subscribe = vi.fn().mockReturnValue(mockSubscription);
    await natsService.connect("nats://localhost:4222");
    await natsService.subscribe("test.subject");
    await natsService.disconnect();
    expect(mockSubscription.drain).toHaveBeenCalled();
    expect(mockConnection.close).toHaveBeenCalled();
  });
});
