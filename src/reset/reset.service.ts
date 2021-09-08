import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Reset } from './reset.entity';
import { ResetInterface } from './reset.interface';
import { UsersService } from '../users/services/users.service';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResetService {
  constructor(
    @InjectRepository(Reset)
    private readonly resetRepository: Repository<Reset>,
    private usersService: UsersService,
    private mailService: MailService,
  ) {}

  async create(reset: ResetInterface): Promise<ResetInterface> {
    return await this.resetRepository.save(reset);
  }

  async findOne(data: any): Promise<ResetInterface> {
    return await this.resetRepository.findOne(data);
  }

  async delete(reset: ResetInterface): Promise<DeleteResult> {
    return await this.resetRepository.delete(reset);
  }

  async checkKey(token: number) {
    const reset = await this.findOne({
      token,
    });

    if (!reset) throw new Error('mail.TOKEN_NOT_FOUND');

    console.log(reset.expiresAt.getTime(), new Date().getTime());

    if (reset.expiresAt.getTime() < new Date().getTime()) {
      await this.delete(reset);
      throw new Error('mail.TOKEN_EXPIRED');
    }

    const user = await this.usersService.findOne({
      email: reset.email,
    });

    return {
      user,
      reset,
    };
  }

  async updatePassword(token: number, password: string) {
    const tokenCheck = await this.checkKey(token);
    const user = tokenCheck.user;
    await this.usersService.updateUser(user.id, { password });
    await this.delete(tokenCheck.reset);
    return {
      message: 'user.PASSWORD_UPDATED_SUCCESSFULLY',
    };
  }

  async sendResetPasswordEmail(email: string, locale: string) {
    const user = await this.usersService.findOne({ email: email });
    if (!user)
      return {
        message: 'mail.RENEW_EMAIL',
      };

    await this.resetRepository.delete({ email });

    const savedResetPassword = await this.create({
      email: user.email,
      token: await uuidv4(),
      expiresAt: new Date(
        new Date().getTime() +
          parseInt(process.env.REFRESH_PASSWORD_TOKEN_SECOND) * 1000,
      ),
    });

    if (savedResetPassword)
      await this.mailService.sendRefreshPassword(
        user,
        savedResetPassword.token,
        locale,
      );
  }
}
