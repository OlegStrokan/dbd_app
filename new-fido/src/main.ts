import { NestFactory } from '@nestjs/core';
import { FidoModule } from './fido.module';

async function bootstrap() {
  const app = await NestFactory.create(FidoModule);
  await app.listen(3000);
}
bootstrap();
