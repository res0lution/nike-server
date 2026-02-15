import type { ConfigService } from '@nestjs/config';
import type { Params } from 'nestjs-pino';
import pino, { type LevelWithSilent } from 'pino';

import type { Env } from './env.schema';

export function buildPinoConfig(configService: ConfigService<Env>): Params {
  const nodeEnv = configService.get('NODE_ENV', { infer: true });
  const logLevel = configService.get('LOG_LEVEL', { infer: true });

  const isProd = nodeEnv === 'production';

  return {
    pinoHttp: {
      level: logLevel ?? 'info',

      timestamp: pino.stdTimeFunctions.isoTime,

      genReqId: (req) => req.headers['x-request-id'] ?? crypto.randomUUID(),

      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'password',
          'token',
          'accessToken',
          'refreshToken',
          'cardNumber',
          'cvv',
        ],
        remove: true,
      },

      transport: !isProd
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: true,
              singleLine: true,
            },
          }
        : undefined,

      customLogLevel: (req, res, err): LevelWithSilent => {
        if (res.statusCode >= 500 || err) {
          return 'error';
        }
        if (res.statusCode >= 400) {
          return 'warn';
        }
        return 'info';
      },

      customProps: () => ({
        service: 'online-store-api',
        env: nodeEnv,
      }),
    },
  };
}
