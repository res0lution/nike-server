import { AppConfigModule } from '@core/config/config.module';
import { LoggerModule } from '@core/logger/logger.module';
import { DatabaseModule } from '@infra/db/database.module';
import { RedisModule } from '@infra/redis/redis.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, LoggerModule, DatabaseModule, RedisModule],
  controllers: [],
})
export class AppModule {}
