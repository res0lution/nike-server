import type { ConfigService } from '@nestjs/config';

import type { Env } from './env.schema';

export interface ProviderConfig {
  client_id: string;
  client_secret: string;
  scopes: string[];
}

export interface ProvidersConfig {
  baseUrl: string;
  services: {
    google: ProviderConfig;
    yandex: ProviderConfig;
  };
}

export const getProvidersConfig = (configService: ConfigService<Env>): ProvidersConfig => ({
  baseUrl: configService.getOrThrow('APPLICATION_URL'),
  services: {
    google: {
      client_id: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      client_secret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile'],
    },
    yandex: {
      client_id: configService.getOrThrow('YANDEX_CLIENT_ID'),
      client_secret: configService.getOrThrow('YANDEX_CLIENT_SECRET'),
      scopes: ['login:email', 'login:avatar', 'login:info'],
    },
  },
});
