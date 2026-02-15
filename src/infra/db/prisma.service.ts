import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaQueryLogger } from './prisma.logger';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'warn'>
  implements OnModuleInit
{
  constructor(private prismaLogger: PrismaQueryLogger) {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    this.$on('query', (e: Prisma.QueryEvent) => {
      this.prismaLogger.logQuery(e);
    });

    this.$on('error', (e) => {
      this.prismaLogger.logError(e);
    });
  }
}
