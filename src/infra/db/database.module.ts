import { Global, Module } from '@nestjs/common';

import { PrismaQueryLogger } from './prisma.logger';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, PrismaQueryLogger],
  exports: [PrismaService],
})
export class DatabaseModule {}
