import { createApiContainer } from "../api/index";
import {
  createJobWorkerContainer,
  IJobWorkerContainer,
} from "../job-worker/index";

export async function createTestContainer() {
  const apiContainer = await createApiContainer();
  const jobWorkerContainer: IJobWorkerContainer =
    await createJobWorkerContainer();

  return { apiContainer, jobWorkerContainer };
}
