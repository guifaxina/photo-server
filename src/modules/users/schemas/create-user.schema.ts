import { UserRole } from 'src/utils/enums/user-type.enum';
import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .strict();

export type TCreateUser = z.infer<typeof createUserSchema>;
