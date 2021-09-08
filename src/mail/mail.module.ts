import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfirmationService } from 'src/confirmation/confirmation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Confirmation } from 'src/confirmation/confirmation.entity';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from './mail.consumer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'mail',
    }),
    TypeOrmModule.forFeature([Confirmation]),
  ],
  providers: [MailService, ConfirmationService, MailConsumer],
  exports: [MailService],
})
export class MailModule {}
