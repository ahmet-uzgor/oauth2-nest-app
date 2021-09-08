import { Inject } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

export class I18nHelper {
  constructor(@Inject(I18nService) private i18n: I18nService) {}

  async translate(message, req) {
    const lang = req?.headers?.locale || 'tr';

    if (!message) return message;

    const args = message?.match(/[^{\}]+(?=})/g);
    const newArgs = {};

    if (args) {
      const startIndex = message.indexOf('{');
      message = message.slice(0, startIndex);
      args.forEach((r) => {
        const key = r.split(':')[0];
        const value = r.split(':')[1];
        newArgs[key] = value;
      });
    }

    const msg = await this.i18n.translate(message, {
      lang,
      args: newArgs,
    });

    return msg;
  }
}
