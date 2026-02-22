import { buildCorsOptions } from '@core/config/cors.config';
import { GlobalExceptionFilter } from '@core/filters/global-exception.filter';
import { LoggerExceptionFilter } from '@core/logger/logger.filter';
import { LoggerInterceptor } from '@core/logger/logger.interceptor';
import { GlobalValidationPipe } from '@core/pipes/global-validation.pipe';
import { REDIS_SESSION } from '@infra/redis/redis.module';
import { buildSessionMiddleware } from '@infra/session/session.factory';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import type Redis from 'ioredis';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const redis = app.get<Redis>(REDIS_SESSION);

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(new GlobalValidationPipe());

  app.useGlobalInterceptors(app.get(LoggerInterceptor));
  app.useGlobalFilters(app.get(LoggerExceptionFilter), app.get(GlobalExceptionFilter));

  app.enableCors(buildCorsOptions(config));

  app.set('trust proxy', 1);
  app.use(buildSessionMiddleware(redis, config));

  await app.listen(config.getOrThrow<number>('PORT'));
}

void bootstrap();
