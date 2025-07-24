import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { TCreateUser } from './schemas/create-user.schema';
import { Roles } from '@prisma/client';

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
        location: data.location,
        bio: data.bio,
        specialties: data.specialties,
        rating: data.rating,
        reviewCount: data.reviewCount,
        portfolioCount: data.portfolioCount,
        profileImage: data.profileImage,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: { email: email },
    });
  }

  async findByUuid(uuid: string) {
    const user = await this.prismaService.user.findUnique({
      where: { uuid: uuid },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        role: true,
        location: true,
        bio: true,
        specialties: true,
        rating: true,
        reviewCount: true,
        portfolioCount: true,
        profileImage: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async findAllPhotographers() {
    return await this.prismaService.user.findMany({
      where: {
        role: Roles.PHOTOGRAPHER,
      },
      select: {
        uuid: true,
        name: true,
        email: true,
        location: true,
        bio: true,
        specialties: true,
        rating: true,
        reviewCount: true,
        portfolioCount: true,
        profileImage: true,
      },
    });
  }
}
