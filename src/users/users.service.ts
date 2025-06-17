import { Prisma } from '@prisma/client';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TCreateUser } from './schemas/create-user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(data: TCreateUser) {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('O email escolhido já existe.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 6);

    return await this.prismaService.user.create({
      omit: {
        password: true,
      },
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email: email },
    });
  }
}
