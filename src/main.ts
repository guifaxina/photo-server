import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodFilter } from './exceptions/zod-exception.filter';
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ZodFilter(), new PrismaClientExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
