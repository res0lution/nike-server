import type { ConfigService } from '@nestjs/config';
import type { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';

import type { Env } from './env.schema';
import { isDev } from '../utils/is-dev.util';

interface RecaptchaRequestHeaders extends Record<string, string | undefined> {
  recaptcha?: string;
}

export const getRecaptchaConfig = (
  configService: ConfigService<Env>,
): GoogleRecaptchaModuleOptions => ({
  secretKey: configService.getOrThrow('GOOGLE_RECAPTCHA_SECRET_KEY'),
  response: (req: Request): string => {
    const headers = req.headers as unknown as RecaptchaRequestHeaders;
    return headers.recaptcha ?? '';
  },
  skipIf: isDev(configService),
});
