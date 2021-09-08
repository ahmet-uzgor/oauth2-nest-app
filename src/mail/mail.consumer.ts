import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mail')
export class MailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    const data = job.data.email || job.data.user.email;
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${data}...`,
    );
  }

  @Process('invitation')
  async sendInvitation(
    job: Job<{
      user;
      email: any;
      token: string;
      course: string;
      locale: string;
    }>,
  ) {
    try {
      const { user, token, course, email, locale } = job.data;
      const url = `${process.env.HOST}/invitation?token=${token}`;
      const result = await this.mailerService.sendMail({
        to: email,
        from: `"Tipstory Team" <${process.env.MAIL_FROM}>`,
        subject: 'Course Invitation',
        template: `./invitation-${locale || 'tr'}`,
        context: {
          user,
          url,
          course,
        },
      });
      return result.accepted;
    } catch (err) {
      throw err;
    }
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    console.log(
      `Complete job ${job.id} of type ${job.name} with data: ${result}`,
    );
  }

  @OnQueueFailed()
  onFail(job: Job, err: Error) {
    console.log(
      `Fail job ${job.id} of type ${job.name} with data ${job.data.email}: Error is ${err.message}`,
    );
  }

  @Process('confirmation')
  async confirmation(job: Job<{ user: any; code: string; locale: string }>) {
    try {
      const { user, code, locale } = job.data;
      const result = await this.mailerService.sendMail({
        to: user.email,
        from: `"Tipstory Team" <${process.env.MAIL_FROM}>`,
        subject: 'Confirmation Profile Service',
        template: `./confirmation-${locale || 'tr'}`,
        context: {
          user,
          code,
        },
      });
      result;
      return result.accepted;
    } catch (err) {
      return err;
    }
  }

  @Process('reset-pass')
  async refreshPass(job: Job<{ user: any; url: string; locale: string }>) {
    try {
      const { user, url, locale } = job.data;
      const result = await this.mailerService.sendMail({
        to: user.email,
        from: `"Tipstory Team" <${process.env.MAIL_FROM}>`,
        subject: 'Forgot Password Service',
        template: `./reset-password-${locale || 'tr'}`,
        context: {
          user,
          url,
        },
      });
      return result.accepted;
    } catch (err) {
      return err;
    }
  }
}
