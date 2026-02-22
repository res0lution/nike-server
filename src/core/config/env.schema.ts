import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  APPLICATION_URL: z.url(),
  COOKIES_SECRET: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().default(0),
  REDIS_TLS: z.string().default('false'),
  REDIS_CONNECT_TIMEOUT: z.coerce.number().default(5000),
  REDIS_MAX_RETRIES: z.coerce.number().default(10),

  GOOGLE_RECAPTCHA_SECRET_KEY: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  YANDEX_CLIENT_ID: z.string(),
  YANDEX_CLIENT_SECRET: z.string(),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_LOGIN: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_FROM: z.string(),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  CORS_ALLOW_ALL_DEV: z.string().default('false'),
  CORS_ORIGINS: z.string().default('https://shop.com,https://admin.shop.com'),

  SESSION_SECRET: z.string(),
  SESSION_NAME: z.string().default('shop.sid'),
  SESSION_TTL: z.coerce.number().default(86400),
  SESSION_SECURE: z.string().default('true'),
  SESSION_HTTP_ONLY: z.string().default('true'),
  SESSION_DOMAIN: z.string().default('shop.com'),
});

export type Env = z.infer<typeof envSchema>;
