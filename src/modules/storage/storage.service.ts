import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'prisma/prisma.service';
import { configService } from 'src/env/env.config';
import { AuthUser } from '../users/types';
import { UsersService } from '../users/users.service';
import { S3_PROVIDER } from './s3.provider';
import { Prisma } from '@prisma/client';
import { FacialRecognitionService } from '../facial-recognition/facial-recognition.service';

@Injectable()
export class StorageService {
  constructor(
    @Inject(S3_PROVIDER) private readonly s3: S3Client,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly recognitionService: FacialRecognitionService,
  ) {}

  async upload(
    allFiles: { file: Express.Multer.File; isMain: boolean }[],
    user: AuthUser,
    description?: string,
    price?: number,
  ) {
    const mainPhoto = allFiles.find((obj) => obj.isMain);
    if (!mainPhoto) {
      throw new Error('Foto principal não encontrada');
    }

    const mainUploadPromises = await this.uploadPhotos(
      [mainPhoto.file],
      user,
      true,
    );
    const [createdMainPhoto] = await Promise.all(mainUploadPromises);

    const filesWithoutMain = allFiles
      .filter((obj) => !obj.isMain)
      .map((obj) => obj.file);

    const uploads = await this.uploadPhotos(
      filesWithoutMain,
      user,
      false,
      createdMainPhoto.id,
      description,
      price,
    );

    await Promise.all(uploads);
  }

  async uploadPhotos(
    files: Express.Multer.File[],
    user: AuthUser,
    isMain = false,
    mainPhotoId?: number,
    description?: string,
    price?: number,
  ) {
    const uploads = files.map(async (file) => {
      const uuid = randomUUID();

      await this.s3.send(
        new PutObjectCommand({
          Bucket: configService.get('R2_BUCKET'),
          Key: uuid,
          Body: file.buffer,
        }),
      );

      const photographer = await this.usersService.findByEmail(user.email);

      const descriptor = await this.recognitionService.extractDescriptor(
        file.buffer,
      );

      const descriptorToJson = descriptor
        ? JSON.parse(JSON.stringify(descriptor))
        : undefined;

      return this.prismaService.photo.create({
        data: {
          key: uuid,
          url: configService.get('R2_PUBLIC_URL') + uuid,
          isMain,
          ...(mainPhotoId && {
            mainPhoto: {
              connect: {
                id: mainPhotoId,
              },
            },
          }),
          description,
          price: new Prisma.Decimal(price || 0.0),
          descriptor: descriptorToJson,
          photographer: {
            connect: {
              id: photographer.id,
            },
          },
        },
      });
    });

    return uploads;
  }
}
