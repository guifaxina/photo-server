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

interface IUploadData {
  file: Express.Multer.File;
  price: number;
}
@Injectable()
export class StorageService {
  constructor(
    @Inject(S3_PROVIDER) private readonly s3: S3Client,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly recognitionService: FacialRecognitionService,
  ) {}

  async upload(dataToUpload: IUploadData[], user: AuthUser) {
    const uploads = await this.uploadPhotos(dataToUpload, user);

    await Promise.all(uploads);
  }

  async uploadPhotos(dataToUpload: IUploadData[], user: AuthUser) {
    const uploads = dataToUpload.map(async ({ file, price }) => {
      const uuid = randomUUID();

      await this.s3.send(
        new PutObjectCommand({
          Bucket: configService.get('R2_BUCKET'),
          Key: uuid,
          Body: file.buffer,
        }),
      );

      const photographer = await this.usersService.findByEmail(user.email);

      const descriptor = (await this.recognitionService.extractDescriptor(
        file.buffer,
      )) as Prisma.JsonArray;

      return this.prismaService.photo.create({
        data: {
          descriptor,
          key: uuid,
          url: configService.get('R2_PUBLIC_URL') + uuid,
          price: new Prisma.Decimal(price || 0.0),
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
