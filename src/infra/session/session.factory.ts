import { getSessionConfig } from '@core/config/session.config';
import type { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import type { Redis } from 'ioredis';

export function buildSessionMiddleware(
  redis: Redis,
  config: ConfigService,
): ReturnType<typeof session> {
  const sessionConfig = getSessionConfig(config);

  return session({
    store: new RedisStore({
      client: redis,
      prefix: 'shop:session:',
      ttl: sessionConfig.ttl,
      disableTouch: false,
    }),

    name: sessionConfig.name,

    secret: sessionConfig.secret,

    resave: true,
    saveUninitialized: false,

    rolling: true,

    cookie: {
      domain: sessionConfig.domain,
      httpOnly: sessionConfig.httpOnly,
      secure: sessionConfig.secure,
      sameSite: 'lax',
      maxAge: sessionConfig.ttl * 1000,
    },
  });
}
