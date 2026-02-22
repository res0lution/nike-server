import { AppLogger } from '@core/logger/logger.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { createRedisClient } from './redis.factory';

export const REDIS_CACHE = Symbol('REDIS_CACHE');
export const REDIS_SESSION = Symbol('REDIS_SESSION');
export const REDIS_QUEUE = Symbol('REDIS_QUEUE');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CACHE,
      inject: [ConfigService, AppLogger],
      useFactory: (cfg: ConfigService, logger: AppLogger): Redis =>
        createRedisClient(cfg, 'cache', logger),
    },
    {
      provide: REDIS_SESSION,
      inject: [ConfigService, AppLogger],
      useFactory: (cfg: ConfigService, logger: AppLogger): Redis =>
        createRedisClient(cfg, 'session', logger),
    },
    {
      provide: REDIS_QUEUE,
      inject: [ConfigService, AppLogger],
      useFactory: (cfg: ConfigService, logger: AppLogger): Redis =>
        createRedisClient(cfg, 'queue', logger),
    },
  ],
  exports: [REDIS_CACHE, REDIS_SESSION, REDIS_QUEUE],
})
export class RedisModule {}
