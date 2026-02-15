import { GlobalExceptionFilter } from '@core/filters/global-exception.filter';
import { LoggerExceptionFilter } from '@core/logging/logger.filter';
import { LoggerInterceptor } from '@core/logging/logger.interceptor';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(app.get(LoggerInterceptor));
  app.useGlobalFilters(app.get(LoggerExceptionFilter), app.get(GlobalExceptionFilter));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
