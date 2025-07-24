import { Injectable, UnauthorizedException, Logger } from '@nestjs/common'; // Importar Logger
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { configService } from 'src/env/env.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name); // Instanciar Logger

  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    this.logger.debug(`JwtStrategy: Validating payload.sub: "${payload.sub}"`);

    // Regex simples para verificar se a string se parece com um UUID
    // Formato UUID v4: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(payload.sub)) {
      this.logger.warn(
        `JwtStrategy: Invalid UUID format in token payload.sub: "${payload.sub}". Returning null.`,
      );
      // Retorna null para indicar que a validação falhou,
      // permitindo que o JwtAuthGuard.handleRequest lide com isso.
      return null;
    }

    try {
      const user = await this.usersService.findByUuid(payload.sub);

      if (!user) {
        this.logger.warn(
          `JwtStrategy: User with UUID "${payload.sub}" not found. Throwing UnauthorizedException.`,
        );
        throw new UnauthorizedException(
          'Usuário não encontrado ou token inválido.',
        );
      }

      this.logger.debug(
        `JwtStrategy: User "${user.email}" successfully validated.`,
      );
      return {
        uuid: user.uuid,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    } catch (error) {
      this.logger.error(
        `JwtStrategy: Error during user validation for UUID "${payload.sub}": ${error.message}`,
      );
      // Re-lança UnauthorizedException para erros de validação de usuário
      // ou para qualquer outro erro inesperado durante a busca.
      throw new UnauthorizedException('Erro na validação do token.');
    }
  }
}
