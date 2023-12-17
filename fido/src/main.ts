import { NestFactory } from '@nestjs/core';
import { ParcelDeliveryModule } from "./parcel-delivery.module";


async function bootstrap() {
  const app = await NestFactory.create(ParcelDeliveryModule);
  await app.listen(3000);
}
bootstrap();
