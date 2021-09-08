import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { LinkAccountService } from 'src/users/services/link-account.service';
import { Platform } from 'src/users/enums/account-platform.enums';

@Injectable()
export class GoogleConnectStrategy extends PassportStrategy(
  Strategy,
  'google-connect',
) {
  constructor(
    private usersService: UsersService,
    private linkAccountService: LinkAccountService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `http://localhost:3000/auth/connect/google`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { emails } = profile;
    const email = emails[0].value;
    const currentUser = request.user;

    const linkAccountResponse = await this.linkAccountService.findOne({
      where: { email, platform: Platform.GOOGLE },
    });

    if (linkAccountResponse)
      throw new HttpException(
        'user.USER_ALREADY_CONNECTED',
        HttpStatus.BAD_REQUEST,
      );

    await this.linkAccountService.create({
      email: currentUser.email,
      platform: Platform.GOOGLE,
      user: currentUser,
    });

    throw new HttpException(
      'user.SUCCESSFULL_CONNECT_ACCOUNT{value:google}',
      HttpStatus.OK,
    );
  }
}
