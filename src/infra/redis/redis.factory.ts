import { getRedisEnvConfig } from '@core/config/redis.config';
import type { AppLogger } from '@core/logger/logger.service';
import type { ConfigService } from '@nestjs/config';
import type { RedisOptions } from 'ioredis';
import Redis from 'ioredis';

export function createRedisClient(
  config: ConfigService,
  namespace: string,
  logger: AppLogger,
): Redis {
  const redisConfig = getRedisEnvConfig(config);

  const options: RedisOptions = {
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    db: redisConfig.db,

    connectTimeout: redisConfig.connectTimeout,

    enableReadyCheck: true,

    maxRetriesPerRequest: redisConfig.maxRetries,

    retryStrategy(times) {
      if (times > redisConfig.maxRetries) {
        return null;
      }
      return Math.min(times * 200, 2000);
    },

    lazyConnect: true,

    ...(redisConfig.tls && { tls: {} }),
  };

  const client = new Redis(options);

  client.on('connect', () => {
    logger.info(`[redis:${namespace}] connected`);
  });

  client.on('error', (e) => {
    logger.error(`[redis:${namespace}] error`, e);
  });

  return client;
}
