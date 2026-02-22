import type { ConfigService } from '@nestjs/config';

import type { Env } from './env.schema';

export interface SessionEnvConfig {
  secret: string;
  name: string;
  ttl: number;
  secure: boolean;
  httpOnly: boolean;
  domain: string;
}

export const getSessionConfig = (configService: ConfigService<Env>): SessionEnvConfig => ({
  secret: configService.getOrThrow('SESSION_SECRET', { infer: true }),
  name: configService.getOrThrow('SESSION_NAME', { infer: true }),
  ttl: Number(configService.getOrThrow('SESSION_TTL', { infer: true })),
  secure: Boolean(configService.getOrThrow('SESSION_SECURE', { infer: true })),
  httpOnly: Boolean(configService.getOrThrow('SESSION_HTTP_ONLY', { infer: true })),
  domain: configService.getOrThrow('SESSION_DOMAIN', { infer: true }),
});
