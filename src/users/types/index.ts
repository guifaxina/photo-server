import { User } from '@prisma/client';
import { UserRole } from 'src/utils/enums/user-type.enum';

export type PublicUser = Omit<User, 'password' | 'id'>;

export type AuthUser = {
  sub: string;
  email: string;
  role: UserRole;
};
