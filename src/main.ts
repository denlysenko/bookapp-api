// tslint:disable-next-line:no-var-requires
require('module-alias/register');
// tslint:disable-next-line:no-var-requires
require('dotenv').config();

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
