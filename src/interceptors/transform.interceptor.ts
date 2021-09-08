import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import { I18nHelper } from 'src/common/helpers/i18n.helper';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T> {
  constructor(private readonly i18nHelper: I18nHelper) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map(async (d) => ({
        statusCode:
          d.statusCode || context.switchToHttp().getResponse().statusCode,
        message: d.message
          ? await this.i18nHelper.translate(d.message, req)
          : undefined,
        data: classToPlain(d.data),
      })),
    );
  }
}
