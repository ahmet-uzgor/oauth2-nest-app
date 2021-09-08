import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nHelper } from 'src/common/helpers/i18n.helper';

@Catch()
export class I18nExceptionsFilter implements ExceptionFilter {
  constructor(private readonly i18nHelper: I18nHelper) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();
    const errorMessage = exception.message;

    const message = await this.i18nHelper.translate(errorMessage, req);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
