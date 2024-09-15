import { IActionLogRepository } from "../index";
import { TestingModule } from "@nestjs/testing";
import { createDbTestingModule } from "../../../database/create-db-module";
import { ActionLogRepository } from "../../infractructure/repository";
import { clearRepos } from "../../../../shared/tools/configs/clear.config";
import { actionLogMocks } from "../mocks";

describe("ActionLogRepository", () => {
  let actionLogRepository: IActionLogRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createDbTestingModule();
    actionLogRepository = module.get<IActionLogRepository>(ActionLogRepository);
  });

  beforeEach(async () => {
    await clearRepos(module);
  });

  afterAll(async () => {
    await clearRepos(module);
  });

  it("should insert action log ", async () => {
    const createdActionLog = await actionLogRepository.insertOne(
      actionLogMocks.getOne()
    );
    expect(createdActionLog).toBeDefined();
  });

  it("should find correct action log ", async () => {
    const actionToCreate = actionLogMocks.getOne();
    await actionLogMocks.createOne(actionToCreate, module);
    const foundActionLog = await actionLogRepository.findOne(actionToCreate.id);
    expect(foundActionLog).toBeDefined();
    expect(foundActionLog).toEqual(actionToCreate);
  });

  it("should findAll correct action log ", async () => {
    await actionLogMocks.createMany(
      3,
      () => ({
        ...actionLogMocks.getOne(),
      }),
      module
    );
    const foundActionLogs = await actionLogRepository.findAll({
      pagination: { limit: 10, offset: 0 },
    });
    expect(foundActionLogs).toBeDefined();
    expect(foundActionLogs).toHaveLength(3);
  });
});
