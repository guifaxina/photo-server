import { User } from '@prisma/client';

export type PublicUser = Omit<User, 'password' | 'id'>;
