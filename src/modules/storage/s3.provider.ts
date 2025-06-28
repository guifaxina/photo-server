import { S3Client } from '@aws-sdk/client-s3';
import { configService } from 'src/env/env.config';

export const S3_PROVIDER = 'S3_PROVIDER';

export const s3Provider = {
  provide: S3_PROVIDER,
  useFactory: async () => {
    return new S3Client({
      region: 'auto',
      endpoint: configService.get('R2_ENDPOINT'),
      credentials: {
        accessKeyId: configService.get('R2_ACCESS_KEY'),
        secretAccessKey: configService.get('R2_SECRET_ACCESS_KEY'),
      },
    });
  },
};
