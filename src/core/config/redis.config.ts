import type { ConfigService } from '@nestjs/config';

import type { Env } from './env.schema';

export interface RedisEnvConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  tls: boolean;
  connectTimeout: number;
  maxRetries: number;
}

export const getRedisEnvConfig = (configService: ConfigService<Env>): RedisEnvConfig => ({
  host: configService.getOrThrow<string>('REDIS_HOST'),
  port: Number(configService.getOrThrow<string>('REDIS_PORT')),
  password: configService.get('REDIS_PASSWORD'),
  db: Number(configService.getOrThrow<string>('REDIS_DB')),
  tls: configService.getOrThrow<boolean>('REDIS_TLS'),
  connectTimeout: Number(configService.getOrThrow<string>('REDIS_CONNECT_TIMEOUT')),
  maxRetries: Number(configService.getOrThrow<string>('REDIS_MAX_RETRIES')),
});
