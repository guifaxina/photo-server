import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TCreateUser } from './schemas/create-user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(data: TCreateUser) {
    return await this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });
  }
}
