import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';
import { RefreshToken } from './refresh-token/entities/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { LinkedinStrategy } from './strategies/linkedin.strategy';
import { LinkAccountService } from 'src/users/services/link-account.service';
import { LinkAccount } from 'src/users/entities/link-account.entity';
import { LinkedinConnectStrategy } from './strategies/linkedin-connect.strategy';
import { GoogleConnectStrategy } from './strategies/google-connect.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    TypeOrmModule.forFeature([LinkAccount]),

    forwardRef(() => UsersModule),
    PassportModule,
    RefreshTokenModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '150'),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    LinkAccountService,
    JwtStrategy,
    GoogleStrategy,
    GoogleConnectStrategy,
    LinkedinStrategy,
    LinkedinConnectStrategy,
    RefreshTokenRepository,
    ConfigService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
