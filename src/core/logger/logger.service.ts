import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

@Injectable()
export class AppLogger {
  constructor(private readonly logger: PinoLogger) {}

  setContext(ctx: string): void {
    this.logger.setContext(ctx);
  }

  domain(meta: Record<string, unknown>): Logger {
    return this.logger.logger.child(meta);
  }

  info(msg: string, data?: unknown): void {
    this.logger.info(data, msg);
  }

  warn(msg: string, data?: unknown): void {
    this.logger.warn(data, msg);
  }

  debug(msg: string, data?: unknown): void {
    this.logger.debug(data, msg);
  }

  error(msg: string, err?: unknown): void {
    if (err instanceof Error) {
      this.logger.error({ err, stack: err.stack }, msg);
      return;
    }
    this.logger.error(err, msg);
  }
}
