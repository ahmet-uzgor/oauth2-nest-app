import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ResetService } from './reset.service';
import { ApiTags, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { SendResetPasswordDto } from './dto/send-reset.dto';
import { ResetPasswordDto } from './dto/reset-password-dto';

@Controller()
@ApiTags('Password-Reset')
@ApiHeader({ name: 'locale' })
export class ResetController {
  constructor(private resetService: ResetService) {}

  @Public()
  @Post('forgot')
  async forgot(@Req() req, @Body() data: SendResetPasswordDto) {
    const locale = req.headers.locale || 'tr';

    const { email } = data;

    await this.resetService.sendResetPasswordEmail(email, locale);

    return {
      message: 'mail.RENEW_EMAIL',
    };
  }

  @Public()
  @Get('forgot-password')
  @ApiQuery({
    name: 'token',
    required: true,
  })
  public async forgotPass(@Query('token') token) {
    try {
      return await this.resetService.checkKey(token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('forgot-password')
  @ApiQuery({
    name: 'token',
    required: true,
  })
  public async updatePassword(
    @Query('token') token,
    @Body() body: ResetPasswordDto,
  ) {
    try {
      const { password } = body;
      return await this.resetService.updatePassword(token, password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
