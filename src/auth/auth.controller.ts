import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login-response.dto';
import { ApiBearerAuth, ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { LinkedInAuthGuard } from './guards/linkedin-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth-guard';
import { LinkedinConnectAuthGuard } from './guards/linkedin-connect-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Platform } from 'src/users/enums/account-platform.enums';
import { GoogleConnectAuthGuard } from './guards/google-connect-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiHeader({ name: 'locale' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  public async refresh(@Body() refreshDto: RefreshDto): Promise<any> {
    return await this.authService.refresh(refreshDto);
  }

  @Public()
  @Get('google')
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'This is google token.',
  })
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return { data: req.user };
  }

  @Public()
  @Get('linkedin')
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'This is linkedin token.',
  })
  @UseGuards(LinkedInAuthGuard)
  async linkedinAuthRedirect(@Req() req) {
    return { data: req.user };
  }

  @Get('google/connect')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'This is google token.',
  })
  @UseGuards(GoogleConnectAuthGuard)
  async googleConnectAuthRedirect(@Req() req) {
    return { data: req.user };
  }

  @ApiBearerAuth()
  @Get('google/disconnect')
  async googleDisconnectAuthRedirect(@CurrentUser() user) {
    return await this.authService.disconnectAccount(user, Platform.GOOGLE);
  }

  @Get('linkedin/connect')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'This is linkedin token.',
  })
  @UseGuards(LinkedinConnectAuthGuard)
  async linkedinConnectAuthRedirect(@Req() req) {
    return { data: req.user };
  }

  @ApiBearerAuth()
  @Get('linkedin/disconnect')
  async linkedinDisconnectAuthRedirect(@CurrentUser() user) {
    return await this.authService.disconnectAccount(user, Platform.LINKEDIN);
  }
}
