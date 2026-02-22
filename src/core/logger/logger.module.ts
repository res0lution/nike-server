import { Env } from '@core/config/env.schema';
import { buildPinoConfig } from '@core/config/logger.config';
import { GlobalExceptionFilter } from '@core/filters/global-exception.filter';
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoModule } from 'nestjs-pino';

import { LoggerExceptionFilter } from './logger.filter';
import { LoggerInterceptor } from './logger.interceptor';
import { AppLogger } from './logger.service';

@Global()
@Module({
  imports: [
    PinoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env>) => buildPinoConfig(configService),
    }),
  ],
  providers: [AppLogger, LoggerInterceptor, LoggerExceptionFilter, GlobalExceptionFilter],
  exports: [AppLogger, LoggerInterceptor, PinoModule],
})
export class LoggerModule {}
