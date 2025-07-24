import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// Removido HttpAdapterHost, pois não é mais necessário para a forma como o filtro é aplicado
// import { HttpAdapterHost } from '@nestjs/core'; // Não é mais necessário

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Aplica o filtro de exceções do Prisma globalmente
  // Removido 'httpAdapter' pois o construtor do PrismaClientExceptionFilter não o espera
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  // Aplica o JwtAuthGuard globalmente
  // O Reflector é injetado para que o guard possa verificar o decorator @Public()
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
