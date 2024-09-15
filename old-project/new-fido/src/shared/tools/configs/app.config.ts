import { registerAs } from "@nestjs/config";

export const AppConfig = registerAs("config", () => ({
  port: parseInt(process.env.PORT, 10) || 8000,
  nodenv: process.env.NODE_ENV,
}));
