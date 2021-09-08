import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { ConfirmationModule } from '../confirmation/confirmation.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersSubscriber } from './users.subscriber';
import { RefreshTokenModule } from '../auth/refresh-token/refresh-token.module';
import { AuthModule } from '../auth/auth.module';
import { LinkAccount } from './entities/link-account.entity';
import { StoriesModule } from '../story/stories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([LinkAccount]),
    MailModule,
    ConfirmationModule,
    RefreshTokenModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '150S'),
        },
      }),
    }),
    StoriesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber],
  exports: [UsersService],
})
export class UsersModule {}
