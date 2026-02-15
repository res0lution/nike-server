import { DomainError } from '@core/errors/domain.error';
import { AppLogger } from '@core/logging/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const requestId = req.id;
    const path = req.url;

    const normalized = this.normalize(exception);

    this.logger.error('Request failed', {
      requestId,
      path,
      status: normalized.status,
      code: normalized.code,
      message: normalized.message,
      meta: normalized.meta,
      stack: normalized.stack,
    });

    res.status(normalized.status).json({
      error: {
        code: normalized.code,
        message: normalized.publicMessage,
        status: normalized.status,
        requestId,
        timestamp: new Date().toISOString(),
        path,
      },
    });
  }

  private normalize(exception: unknown): {
    status: number;
    code: string;
    message: string;
    publicMessage: string;
    meta: Record<string, unknown>;
    stack: string;
  } {
    if (exception instanceof DomainError) {
      return {
        status: exception.status,
        code: exception.code,
        message: exception.message,
        publicMessage: exception.message,
        meta: exception.meta ?? {},
        stack: exception.stack ?? '',
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse();

      const respObj = this.isObjectResponse(resp) ? resp : {};

      const code =
        typeof respObj.code === 'string'
          ? respObj.code
          : status === 401
            ? 'AUTH_UNAUTHORIZED'
            : status === 403
              ? 'AUTH_FORBIDDEN'
              : this.httpCode(status);

      const message = typeof respObj.message === 'string' ? respObj.message : exception.message;

      return {
        status,
        code,
        message,
        publicMessage: message,
        meta: this.safeMeta(respObj),
        stack: exception.stack ?? '',
      };
    }

    if (this.isPrismaError(exception)) {
      return {
        status: 400,
        code: 'DB_ERROR',
        message: 'Database error',
        publicMessage: 'Database operation failed',
        meta: {},
        stack: this.isError(exception) ? (exception.stack ?? '') : '',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'Unhandled error',
      publicMessage:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : this.isError(exception)
            ? exception.message
            : '',
      meta: {},
      stack: this.isError(exception) ? (exception.stack ?? '') : '',
    };
  }

  private httpCode(status: number): string {
    return `HTTP_${String(status)}`;
  }

  private isPrismaError(e: unknown): e is { code: unknown; stack?: string } {
    if (typeof e !== 'object' || e === null) {
      return false;
    }

    if (!('code' in e)) {
      return false;
    }

    const code = (e as Record<string, unknown>).code;

    return typeof code === 'string' && code.startsWith('P');
  }

  private isError(e: unknown): e is Error {
    return e instanceof Error;
  }

  private isObjectResponse(resp: unknown): resp is Record<string, unknown> {
    return typeof resp === 'object' && resp !== null;
  }

  private safeMeta(meta: Record<string, unknown>): Partial<Record<string, unknown>> {
    const clone = { ...meta };

    delete clone.session;
    delete clone.sessionID;
    delete clone.cookie;

    return clone;
  }
}
