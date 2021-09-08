import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class RefreshTokenService {
  private refreshTokenRepository: RefreshTokenRepository;

  constructor(private readonly connection: Connection) {
    this.refreshTokenRepository = this.connection.getCustomRepository(
      RefreshTokenRepository,
    );
  }

  async create(data: any): Promise<RefreshToken> {
    return await this.refreshTokenRepository.createRefreshToken(data);
  }

  async update(refresh: RefreshToken): Promise<RefreshToken> {
    return await this.refreshTokenRepository.save(refresh);
  }

  async findOne(data: any): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne(data);
  }
}
