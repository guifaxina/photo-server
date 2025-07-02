import { Injectable, Inject } from '@nestjs/common';
import { S3_PROVIDER } from './s3.provider';
import {
  PutObjectCommandInput,
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { configService } from 'src/env/env.config';
import { PrismaService } from 'prisma/prisma.service';
import { randomUUID } from 'node:crypto';
import { AuthUser } from '../users/types';
import { UsersService } from '../users/users.service';

@Injectable()
export class StorageService {
  constructor(
    @Inject(S3_PROVIDER) private readonly s3: S3Client,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async upload(
    allFiles: { file: Express.Multer.File; isMain: boolean }[],
    user: AuthUser,
  ) {
    const mainPhoto = allFiles.find((obj) => obj.isMain);
    const mainUpload = await this.uploadPhotos([mainPhoto.file], user, true);
    const createdMainPhoto = await mainUpload[0];

    const filesWithoutMain = allFiles
      .filter((obj) => !obj.isMain)
      .map((obj) => obj.file);

    const uploads = await this.uploadPhotos(
      filesWithoutMain,
      user,
      false,
      createdMainPhoto.id,
    );

    await Promise.all(uploads);
  }

  async uploadPhotos(
    files: Express.Multer.File[],
    user: AuthUser,
    isMain = false,
    mainPhotoId?: number,
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

      return this.prismaService.photo.create({
        data: {
          photographerId: photographer.id,
          key: uuid,
          url: configService.get('R2_PUBLIC_URL') + uuid,
          isMain,
          mainPhotoId,
        },
      });
    });

    return uploads;
  }
}
