import { Module } from '@nestjs/common';
import { FacialRecognitionController } from './facial-recognition.controller';
import { FacialRecognitionService } from './facial-recognition.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [FacialRecognitionController],
  providers: [FacialRecognitionService, PrismaService],
  exports: [FacialRecognitionService],
})
export class FacialRecognitionModule {}
