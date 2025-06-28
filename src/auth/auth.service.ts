import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PublicUser } from 'src/modules/users/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      throw new NotFoundException('Usuário ou senha incorretos');
    }

    const { password: userPassword, id, ...result } = user;

    return result;
  }

  async login(user: PublicUser) {
    const payload = { email: user.email, sub: user.uuid, role: user.role };

    return { access_token: this.jwtService.sign(payload) };
  }
}
