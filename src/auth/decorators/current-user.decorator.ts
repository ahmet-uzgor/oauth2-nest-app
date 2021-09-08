import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { unauthorized } from '../../common/errors';
export interface CurrentUserOptions {
  required?: boolean;
}

export const CurrentUser: (options?: CurrentUserOptions) => ParameterDecorator =
  createParamDecorator(
    (
      data: unknown,
      context: ExecutionContext,
      options: CurrentUserOptions = {},
    ) => {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        unauthorized({ raise: true, msg: 'auth.IS_EXPIRED' });
      }
      return user;
    },
  );
