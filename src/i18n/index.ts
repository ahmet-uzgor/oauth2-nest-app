import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n';

@Injectable()
export class HeaderResolver implements I18nResolver {
  constructor(@I18nResolverOptions() private keys: string[]) {}

  resolve(context: ExecutionContext) {
    let req: any;

    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
    }

    let lang: string;

    if (req) {
      for (const key of this.keys) {
        if (req.header != undefined && req.headers[key] !== undefined) {
          lang = req.headers[key];
          break;
        }
      }
    }
    return lang;
  }
}
