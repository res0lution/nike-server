import { AppLogger } from '@core/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Logger } from 'pino';

@Injectable()
export class PrismaQueryLogger {
  private dbLog: Logger;
  private readonly SLOW_QUERY_THRESHOLD = 500;
  private readonly MAX_PARAM_LENGTH = 500;

  constructor(private logger: AppLogger) {
    this.dbLog = this.logger.domain({
      context: 'PrismaQueryLogger',
      domain: 'db',
      component: 'prisma',
    });
  }

  logQuery(e: { query: string; params: string; duration: number }): void {
    const payload = {
      durationMs: e.duration,
      params: this.safeParams(e.params),
    };

    if (e.duration > this.SLOW_QUERY_THRESHOLD) {
      this.dbLog.warn(payload, 'Slow query');
    } else {
      this.dbLog.debug(payload, 'Executed query');
    }
  }

  logError(e: unknown): void {
    this.dbLog.error(e, 'Prisma error');
  }

  private safeParams(params: string): string {
    if (!params) {
      return params;
    }

    if (params.length > this.MAX_PARAM_LENGTH) {
      return '[large params redacted]';
    }

    return params;
  }
}
