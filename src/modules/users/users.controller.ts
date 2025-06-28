import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, TCreateUser } from './schemas/create-user.schema';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AuthUser } from './types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: AuthUser) {
    return user;
  }

  @Post('register')
  async register(@Body(new ZodPipe(createUserSchema)) createUser: TCreateUser) {
    return await this.usersService.register(createUser);
  }
}
