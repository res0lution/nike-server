import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { ConfigService } from '@nestjs/config';

import type { Env } from './env.schema';

type CorsCallback = (err: Error | null, allow?: boolean) => void;

export function buildCorsOptions(config: ConfigService<Env>): CorsOptions {
  const allowAllDev = config.get('CORS_ALLOW_ALL_DEV', { infer: true });
  const origins = config.get('CORS_ORIGINS', { infer: true });
  const nodeEnv = config.get('NODE_ENV', { infer: true });

  const isDev = nodeEnv !== 'production';

  return {
    origin: (origin: string | undefined, cb: CorsCallback): void => {
      if (isDev && allowAllDev) {
        cb(null, true);
        return;
      }

      // mobile / curl / server-to-server
      if (!origin) {
        cb(null, true);
        return;
      }

      if (origins?.includes(origin)) {
        cb(null, true);
        return;
      }

      cb(new Error(`CORS blocked: ${origin}`));
    },

    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],

    exposedHeaders: ['X-Request-Id'],

    maxAge: 86400,
  };
}
