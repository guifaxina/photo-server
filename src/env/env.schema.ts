import { z } from 'zod';

export const envSchema = z.object({
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  R2_ACCESS_KEY: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_ENDPOINT: z.string(),
  R2_BUCKET: z.string(),
  R2_PUBLIC_URL: z.string(),
});

export type EnvVariables = z.infer<typeof envSchema>;
