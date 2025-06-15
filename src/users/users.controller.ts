import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, TCreateUser } from './schemas/create-user.schema';
import { ZodPipe } from 'src/pipes/zod.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body(new ZodPipe(createUserSchema)) createUser: TCreateUser) {
    return this.usersService.register(createUser);
  }
}
