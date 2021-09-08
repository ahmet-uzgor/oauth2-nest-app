import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { user } = context.switchToHttp().getRequest();

    if (!user.confirmEmail) {
      throw new UnauthorizedException('Confirm your email first');
    }
    return true;
  }
}
