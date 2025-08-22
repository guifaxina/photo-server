import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { FacialRecognitionService } from '../facial-recognition/facial-recognition.service';

@Injectable()
export class PhotosService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly recognitionService: FacialRecognitionService,
  ) {}

  async findPhotosByPhotographerUuid(photographerUuid: string) {
    const photographer = await this.usersService.findByUuid(photographerUuid);

    if (!photographer) {
      throw new NotFoundException('Fotógrafo não encontrado.');
    }

    const photos = await this.prismaService.photo.findMany({
      where: {
        photographerId: photographer.id,
        isMain: true,
      },
      select: {
        uuid: true,
        url: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        photographer: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });

    return photos;
  }

  async findPhotoByUuid(photoUuid: string) {
    const photo = await this.prismaService.photo.findUnique({
      where: { uuid: photoUuid },
      select: {
        uuid: true,
        url: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        photographer: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });

    if (!photo) {
      throw new NotFoundException('Foto não encontrada.');
    }
    return photo;
  }

  async findAllPhotos(photoSearch?: Express.Multer.File) {
    if (photoSearch) {
      const descriptor = await this.recognitionService.extractDescriptor(
        photoSearch.buffer,
      );

      if (!descriptor) {
        throw new BadRequestException(
          'Não foi possível identificar um rosto na foto, tente novamente.',
        );
      }

      return this.recognitionService.findMatchingFaces(descriptor);
    }

    const photos = await this.prismaService.photo.findMany({
      where: {
        isMain: true,
      },
      select: {
        uuid: true,
        url: true,
        description: true,
        price: true,
        createdAt: true,
        photographer: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });
    return photos;
  }
}
