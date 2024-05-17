import { IntegrationLayerApp } from "./app/app";

export const startApp = async () => {
  try {
    const app = new IntegrationLayerApp();
    return app.start();
  } catch (error) {
    console.error("Error starting app", error);
  }
};

startApp().catch((error) => console.error(error));
