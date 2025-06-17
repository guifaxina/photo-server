import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './env.schema';

export const configService = new ConfigService<EnvVariables>();
