import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { s3Provider } from './s3.provider';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { FacialRecognitionModule } from '../facial-recognition/facial-recognition.module';

@Module({
  imports: [FacialRecognitionModule],
  controllers: [StorageController],
  providers: [s3Provider, StorageService, PrismaService, UsersService],
})
export class StorageModule {}
