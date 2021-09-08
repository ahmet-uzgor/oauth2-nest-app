import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { ConfirmationService } from 'src/confirmation/confirmation.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UsersService } from 'src/users/services/users.service';
import validator from 'validator';
import isLength = validator.isLength;
config();

@Injectable()
export class MailService {
  constructor(
    private confirmationService: ConfirmationService,
    private mailerService: MailerService,
    @InjectQueue('mail') private mailQueue: Queue,
  ) {}

  generateCode() {
    let code = '';
    const numbers = '1234567890';

    for (let i = 0; i < 4; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
  }

  public async sendUserConfirmation(user, code: string, locale: string) {
    // const url = `${process.env.HOST}/api/users/confirm?token=${token}`;
    try {
      const job = await this.mailQueue.add('confirmation', {
        user,
        code,
        locale,
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  public async sendRefreshPassword(user: any, token: string, locale: string) {
    try {
      const url = `${process.env.HOST}/new-password?token=${token}`;
      const job = await this.mailQueue.add('reset-pass', { user, url, locale });
      return true;
    } catch (err) {
      return false;
    }
  }

  public async sendMailConfirmationCode(user, locale) {
    await this.confirmationService.deleteAll(user.email);

    const code = this.generateCode();
    const savedCode = await this.confirmationService.create({
      email: user.email,
      code,
      expiresAt: new Date(
        new Date().getTime() +
          parseInt(process.env.MAIL_CONFIRMATION_TOKEN_SECOND) * 1000,
      ),
    });

    if (savedCode)
      await this.sendUserConfirmation(user, savedCode.code, locale);
  }

  public async sendInvitation(
    user,
    email: any,
    token: string,
    course: string,
    locale: string,
  ) {
    try {
      const job = await this.mailQueue.add('invitation', {
        user,
        email,
        token,
        course,
        locale,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
