import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, TCreateUser } from './schemas/create-user.schema';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body(new ZodPipe(createUserSchema)) createUser: TCreateUser) {
    return await this.usersService.register(createUser);
  }
}
