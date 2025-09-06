import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FacialRecognitionService } from './facial-recognition.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('facial-recognition')
export class FacialRecognitionController {
  constructor(
    private readonly facialRecognitionService: FacialRecognitionService,
  ) {}

  @Post('identify')
  @UseInterceptors(FileInterceptor('file'))
  async identify(@UploadedFile() file: Express.Multer.File) {
    return await this.facialRecognitionService.identify(file);
  }
}
