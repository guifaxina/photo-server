import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const handler = context.getHandler();
    const classRef = context.getClass();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      handler,
      classRef,
    ]);

    this.logger.debug(`canActivate: Route isPublic = ${isPublic}`);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`handleRequest: Route isPublic = ${isPublic}`);
    this.logger.debug(
      `handleRequest: err = ${err}, user = ${user}, info = ${info}`,
    );

    if (isPublic) {
      return user || {};
    }

    if (err || !user) {
      this.logger.error(
        `handleRequest: Unauthorized access attempt. Error: ${err?.message || 'No user'}`,
      );
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
