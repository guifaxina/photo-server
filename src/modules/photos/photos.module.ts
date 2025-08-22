import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { FacialRecognitionModule } from '../facial-recognition/facial-recognition.module';

@Module({
  imports: [PrismaModule, UsersModule, FacialRecognitionModule],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
