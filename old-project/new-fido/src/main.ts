import { otelSDK } from "./tracing";
import { NestFactory } from "@nestjs/core";
import { FidoModule } from "./fido.module";

async function bootstrap() {
  // start tracing
  otelSDK.start();

  const app = await NestFactory.create(FidoModule);
  // start app
  await app.listen(3000);
}
bootstrap();
