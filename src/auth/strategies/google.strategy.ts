import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { v4 as uuid } from 'uuid';
import { Platform } from 'src/users/enums/account-platform.enums';
import { Provider } from 'src/users/enums/user-provider.enums';
import { LinkAccountService } from 'src/users/services/link-account.service';

import { uploadWithLink } from 'src/common/helpers/cdn-upload.helper';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private usersService: UsersService,
    private linkAccountService: LinkAccountService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `http://localhost:3000/auth/google`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const email = emails[0].value;
    const profilePicture = photos[0].value;

    const newUser = {
      email,
      profilePicture: await uploadWithLink(profilePicture),
      name: name.givenName,
      surname: name.familyName,
      confirmEmail: emails[0].verified,
      password: id + uuid(),
      provider: Provider.GOOGLE,
    };

    let returnData = null;

    const foundedUser = await this.usersService.findOne({ email });

    if (foundedUser)
      returnData = await this.usersService.loginOtherOauth(foundedUser);
    else {
      const linkAccountResponse = await this.linkAccountService.findOne({
        where: { email, platform: Platform.GOOGLE },
        relations: ['user'],
      });

      if (linkAccountResponse)
        returnData = await this.usersService.loginOtherOauth(
          linkAccountResponse.user,
        );
      else {
        returnData = await this.usersService.createOtherOauth(newUser);
        await this.linkAccountService.create({
          email,
          platform: Platform.GOOGLE,
          user: returnData.user,
        });
      }
    }

    done(null, returnData);
  }
}
