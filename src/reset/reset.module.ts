import { Module } from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetController } from './reset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reset } from './reset.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ResetsSubscriber } from './reset.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reset]),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  providers: [ResetService, ResetsSubscriber],
  controllers: [ResetController],
})
export class ResetModule {}
