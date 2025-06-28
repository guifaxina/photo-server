import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async upload(files: Express.Multer.File[], user: AuthUser) {
    const uploads = files.map(async (file) => {
      const uuid = randomUUID();

      const params: PutObjectCommandInput = {
        Bucket: configService.get('R2_BUCKET'),
        Key: uuid,
        Body: file.buffer,
      };
      const command = new PutObjectCommand(params);

      try {
        await this.s3.send(command);
        const photographer = await this.usersService.findByEmail(user.email);

        return this.prismaService.photo.create({
          data: {
            photographerId: photographer.id,
            key: uuid,
            url: configService.get('R2_PUBLIC_URL') + uuid,
          },
        });
      } catch {
        throw new InternalServerErrorException();
      }
    });

    await Promise.all(uploads);
  }
}
