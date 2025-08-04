import { Controller, Get, Param } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Public()
  @Get()
  async findAll() {
    return this.photosService.findAllPhotos();
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
