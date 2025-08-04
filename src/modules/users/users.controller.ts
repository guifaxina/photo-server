import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { createUserSchema, TCreateUser } from './schemas/create-user.schema';
import { AuthUser } from './types';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'; // Certifique-se de importar JwtAuthGuard

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get('photographers')
  async listAllPhotographers() {
    this.logger.debug(
      'UsersController: listAllPhotographers route hit. This route should be public.',
    );
    return this.usersService.findAllPhotographers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: AuthUser) {
    this.logger.debug(
      `UsersController: profile route hit for user: ${user.email}`,
    );
    return user;
  }

  @Public()
  @Post('register')
  async register(@Body(new ZodPipe(createUserSchema)) createUser: TCreateUser) {
    return await this.usersService.register(createUser);
  }

  @Public()
  @Get(':uuid')
  async findUserByUuid(@Param('uuid') uuid: string) {
    this.logger.debug(
      `UsersController: findUserByUuid route hit with UUID: "${uuid}"`,
    );
    return this.usersService.findByUuid(uuid);
  }
}
