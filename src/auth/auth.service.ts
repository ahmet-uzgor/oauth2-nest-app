import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './refresh-token/entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { ConfigService } from '@nestjs/config';
import { LoginResponse } from './dto/login-response.dto';
import { RefreshTokenRepository } from './refresh-token/refresh-token.repository';
import { LoginDto } from './dto/login.dto';
import { refreshTokenExpiredSignature, unauthorized } from '../common/errors';
import { RefreshDto } from './dto/refresh.dto';
import { checkPassword } from '../common/helpers/password.helper';
import { LinkAccountService } from 'src/users/services/link-account.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly usersService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private linkAccountService: LinkAccountService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.usersService.findOne({ email: email });

    if (user) {
      const comparePassword = await checkPassword(password, user.password);
      if (comparePassword) return user;

      //incorrect password
      unauthorized({ raise: true, msg: 'user.INCORRECT' });
    }

    //not found user
    unauthorized({ raise: true, msg: 'user.INCORRECT' });
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginDto);
    const refresh = await this.createRefreshToken(user);
    return { data: await this.token(user, refresh) };
  }

  async validateRefreshToken(token: string): Promise<any> {
    const verify = this.jwt.verify(token);
    if (!verify) return null;

    const db = await this.refreshTokenRepository.getRefreshToken(verify);
    if (!db || !this.checkExpiresAt(db.refreshTokenExpiresAt)) return null;

    return db;
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    const verifiedRefreshToken = await this.validateRefreshToken(refreshToken);
    if (!verifiedRefreshToken) {
      refreshTokenExpiredSignature({ raise: true });
    }
    const update = await this.updateRefreshToken(verifiedRefreshToken);
    const user = await this.getUser(update.userId);
    return { data: await this.token(user, update) };
  }

  async createRefreshToken(user: User): Promise<RefreshToken> {
    return await this.refreshTokenService.create({ user });
  }

  async updateRefreshToken(refresh: RefreshToken): Promise<RefreshToken> {
    //refresh.refreshToken = '';
    return await this.refreshTokenService.update(refresh);
  }

  async getUser(id: any): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  async token(user: User, refresh: RefreshToken): Promise<LoginResponse> {
    const accessToken = this.jwt.sign(user.jwtPayload(), {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRES_IN')}s`,
    });
    const refreshToken = this.jwt.sign(
      {
        refreshToken: refresh.refreshToken,
        user: user.jwtPayload(),
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: `${this.configService.get('REFRESH_TOKEN_EXPIRES_IN')}s`,
      },
    );
    const expiresIn = new Date(
      new Date().getTime() +
        parseInt(this.configService.get('JWT_EXPIRES_IN')) * 1000,
    );
    return new LoginResponse(
      accessToken,
      expiresIn,
      refreshToken,
      refresh.refreshTokenExpiresAt,
      user,
    );
  }

  async disconnectAccount(user, platform: string) {
    const linkAccountResponse = await this.linkAccountService.findOne({
      platform,
      user,
    });

    if (!linkAccountResponse)
      throw new HttpException(
        `user.NOT_CONNECT_${platform}`,
        HttpStatus.BAD_REQUEST,
      );

    if (user.provider == linkAccountResponse.platform)
      throw new HttpException(
        `user.CANNOT_UNLINK_MAIN_ACCOUNT{value:${platform}}`,
        HttpStatus.BAD_REQUEST,
      );

    await this.linkAccountService.remove(linkAccountResponse);

    return {
      message: `user.SUCCESSFULL_DISCONNECT_ACCOUNT{value:${platform}}`,
    };
  }

  protected checkExpiresAt(expiresAt: Date) {
    return new Date(expiresAt).toISOString() > new Date().toISOString();
  }
}
