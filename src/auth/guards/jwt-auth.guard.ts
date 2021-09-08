import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/services/users.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { unauthorized } from '../../common/errors';
import { v4 as uuidv4 } from 'uuid';

export const Scopes = (...scopes: string[]) => SetMetadata('scopes', scopes);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public scopes = [];

  constructor(private reflector: Reflector, private userService: UsersService) {
    super();
  }
  canActivate(context: ExecutionContext) {
    /* Create the cookie process */
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const currentTrackId = req.cookies['track-id'];
    let newTrackId = null;
    if (!currentTrackId) {
      newTrackId = uuidv4();
      res.cookie('track-id', newTrackId);
    }
    /* Create the cookie process */

    this.scopes = this.reflector.get<string[]>('scopes', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    return super.canActivate(new ExecutionContextHost([request]));
  }
  handleRequest(err, user) {
    if (user) {
      user = this.userService.findOne({
        where: { salt: user.salt },
        relations: ['linkAccounts'],
      });
    } else if (!user) unauthorized({ raise: true, msg: 'auth.IS_EXPIRED' });
    else if (err) {
      throw err;
    }
    return user;
  }
}
