import * as common from '@nestjs/common';
import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

@common.Injectable()
export class GlobalValidationPipe extends NestValidationPipe {
  constructor(options?: common.ValidationPipeOptions) {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: { target: false, value: false },
      ...options,
      exceptionFactory: (errors) => {
        const messages = errors.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        }));
        return new common.BadRequestException({ errors: messages });
      },
    });
  }
}
