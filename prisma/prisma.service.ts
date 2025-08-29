import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    // @ts-ignore
    this.$use(async (params, next) => {
      const result = await next(params);

      const convertDecimals = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
        if (obj instanceof Decimal) return obj.toNumber();
        if (Array.isArray(obj)) return obj.map(convertDecimals);
        if (typeof obj === 'object') {
          for (const key in obj) {
            obj[key] = convertDecimals(obj[key]);
          }
        }
        return obj;
      };

      return convertDecimals(result);
    });
  }
}
