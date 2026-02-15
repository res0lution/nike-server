import type { ConfigService } from '@nestjs/config';

import type { Env } from './env.schema';
import { isDev } from '../utils/is-dev.util';

export interface MailerConfig {
  transport: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  defaults: {
    from: string;
  };
}

export const getMailerConfig = (configService: ConfigService<Env>): MailerConfig => ({
  transport: {
    host: configService.getOrThrow('MAIL_HOST'),
    port: configService.getOrThrow('MAIL_PORT'),
    secure: !isDev(configService),
    auth: {
      user: configService.getOrThrow('MAIL_LOGIN'),
      pass: configService.getOrThrow('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `"Nike Dev Team" ${configService.getOrThrow<string>('MAIL_FROM')}`,
  },
});
