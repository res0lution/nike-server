import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

import { AppLogger } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const start = Date.now();

    this.logger.info('HTTP request start', {
      method: req.method,
      url: req.url,
      requestId: req.id,
      userId: req.user?.id,
    });

    return next.handle().pipe(
      tap(() => {
        this.logger.info('HTTP request done', {
          method: req.method,
          url: req.url,
          duration: Date.now() - start,
        });
      }),
    );
  }
}
