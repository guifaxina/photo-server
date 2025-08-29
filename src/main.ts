import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// Removido HttpAdapterHost, pois não é mais necessário para a forma como o filtro é aplicado
// import { HttpAdapterHost } from '@nestjs/core'; // Não é mais necessário

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const logger = new Logger('HTTP');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.originalUrl}`);
    next();
  });

  // Aplica o filtro de exceções do Prisma globalmente
  // Removido 'httpAdapter' pois o construtor do PrismaClientExceptionFilter não o espera
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  // Aplica o JwtAuthGuard globalmente
  // O Reflector é injetado para que o guard possa verificar o decorator @Public()
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
