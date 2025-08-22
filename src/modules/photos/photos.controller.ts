import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Public } from 'src/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Public()
  @Post('find-all')
  @UseInterceptors(FileInterceptor('file'))
  async findAll(@UploadedFile() photoSearch?: Express.Multer.File) {
    return await this.photosService.findAllPhotos(photoSearch);
  }

  @Public()
  @Get('by-photographer/:photographerUuid')
  async getPhotosByPhotographer(
    @Param('photographerUuid') photographerUuid: string,
  ) {
    return this.photosService.findPhotosByPhotographerUuid(photographerUuid);
  }

  @Public()
  @Get(':photoUuid')
  async getPhotoByUuid(@Param('photoUuid') photoUuid: string) {
    return this.photosService.findPhotoByUuid(photoUuid);
  }
}
