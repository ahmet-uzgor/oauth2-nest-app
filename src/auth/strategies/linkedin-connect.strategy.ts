import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LinkAccountService } from 'src/users/services/link-account.service';
import { Platform } from 'src/users/enums/account-platform.enums';

@Injectable()
export class LinkedinConnectStrategy extends PassportStrategy(
  Strategy,
  'linkedin-connect',
) {
  constructor(private linkAccountService: LinkAccountService) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: `http://localhost:3000/auth/connect/linkedin`,
      scope: ['r_liteprofile', 'r_emailaddress'],
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
      where: { email, platform: Platform.LINKEDIN },
    });

    if (linkAccountResponse)
      throw new HttpException(
        'user.USER_ALREADY_CONNECTED',
        HttpStatus.BAD_REQUEST,
      );

    await this.linkAccountService.create({
      email: currentUser.email,
      platform: Platform.LINKEDIN,
      user: currentUser,
    });

    throw new HttpException(
      'user.SUCCESSFULL_CONNECT_ACCOUNT{value:linkedin}',
      HttpStatus.OK,
    );
  }
}
