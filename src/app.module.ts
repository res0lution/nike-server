import { AppConfigModule } from '@core/config/config.module';
import { LoggerModule } from '@core/logging/logger.module';
import { DatabaseModule } from '@infra/db/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, LoggerModule, DatabaseModule],
  controllers: [],
})
export class AppModule {}
