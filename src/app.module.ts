import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { envSchema, EnvVariables } from './env/env.schema';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './modules/storage/storage.module';
import { CartModule } from './modules/cart/cart.module';
import { PhotosModule } from './modules/photos/photos.module';
import { FacialRecognitionModule } from './modules/facial-recognition/facial-recognition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config: Record<string, unknown>): EnvVariables =>
        envSchema.parse(config),
    }),
    UsersModule,
    AuthModule,
    StorageModule,
    CartModule,
    PhotosModule,
    FacialRecognitionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
