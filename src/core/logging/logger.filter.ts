import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request } from 'express';

import { AppLogger } from './logger.service';

@Catch()
export class LoggerExceptionFilter implements ExceptionFilter {
  constructor(private logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost): unknown {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      this.logger.warn('HTTP exception', {
        path: req.url,
        status: exception.getStatus(),
        message: exception.message,
      });
    } else {
      this.logger.error('Unhandled exception', exception);
    }

    throw exception;
  }
}
