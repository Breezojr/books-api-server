import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { corsConfig } from './config/cors.config';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('main')
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsConfig);
  const port = parseInt(process.env.SERVER_PORT) || 3000
  await app.listen(port);
  logger.log(`App started at port ${port}`)
}
bootstrap();
