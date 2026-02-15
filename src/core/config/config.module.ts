import { ConfigModule } from '@nestjs/config';

import { envSchema } from './env.schema';

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,

  envFilePath: [`.env`],

  validate: (env) => {
    const parsed = envSchema.parse(env);
    return parsed;
  },
});
