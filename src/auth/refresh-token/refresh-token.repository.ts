import { EntityRepository, getRepository, Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  createRefreshToken = async (options: any) => {
    return await this.save(options);
  };

  async getRefreshToken(verify: any) {
    return await getRepository(RefreshToken)
      .createQueryBuilder('refreshToken')
      .leftJoin('refreshToken.user', 'user')
      .where('user.salt = :salt', {
        salt: verify.user.salt,
      })
      .getOne();
  }
}
