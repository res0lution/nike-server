import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.url(),

  APPLICATION_URL: z.url(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),

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
});

export type Env = z.infer<typeof envSchema>;
