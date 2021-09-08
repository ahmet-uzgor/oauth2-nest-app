import { User } from '../../users/entities/user.entity';

export class LoginResponse {
  constructor(
    accessToken: string,
    expiresIn: Date,
    refreshToken: string,
    refreshTokenExpiresAt: Date,
    user: User,
  ) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresAt = refreshTokenExpiresAt;
    this.user = user;
  }

  accessToken: string;

  expiresIn: Date;

  refreshToken: string;

  refreshTokenExpiresAt: Date;

  user: User;
}
