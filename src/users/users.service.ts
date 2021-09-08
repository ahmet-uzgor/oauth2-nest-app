import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MailService } from '../mail/mail.service';
import { ConfirmationService } from '../confirmation/confirmation.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../auth/refresh-token/refresh-token.service';
import { LoginResponse } from '../auth/dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from '../auth/refresh-token/entities/refresh-token.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { capitalizeFirstLetter } from '../utils/character';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly mailService: MailService,
    private confirmationService: ConfirmationService,
    private readonly jwt: JwtService,
    private refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
  ) {}

  async findUserById(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('user.USER_NOT_FOUND`');
    }
    return user;
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }

  async findOne(data: any): Promise<User> {
    return await this.usersRepository.findOne(data);
  }

  async findAll(): Promise<any> {
    return { data: await this.usersRepository.find() };
  }

  // async findCourses(id: number) {
  //   const user = await this.usersRepository.findOne(id, {
  //     relations: ['story'],
  //   });
  //   const { story } = user;
  //   const coursesWithTitle = story.map((course) => {
  //     return {
  //       title:
  //       }),
  //     };
  //   });
  //   return { data: story };
  // }

  async create(user: any, locale: string) {
    try {
      const newUser = await this.usersRepository.create(user);
      const savedUser = await this.usersRepository.save(newUser);

      await this.mailService.sendMailConfirmationCode(savedUser, locale);

      return savedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createOtherOauth(user: any) {
    try {
      const newUser = await this.usersRepository.create(user);
      const savedUser = await this.usersRepository.save(newUser);

      const refresh = await this.createRefreshToken(savedUser);
      const data = await this.getToken(savedUser, refresh);
      return data;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  /* Temizlenecek */
  async getToken(user, refresh) {
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

  async createRefreshToken(user: any): Promise<RefreshToken> {
    return await this.refreshTokenService.create({ user });
  }
  /* Temizlenecek */

  async loginOtherOauth(user: any) {
    try {
      const foundUser = await this.findOne({ email: user['email'] });
      if (!foundUser) throw new Error('user.USER_NOT_FOUND`');
      const refresh = await this.createRefreshToken(foundUser);
      const data = await this.getToken(foundUser, refresh);
      return data;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  async update(user: User) {
    await this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException('user.USER_NOT_FOUND');
    }
    return { data: await this.usersRepository.save(user) };
  }

  async checkMailKey(email: string, code: number) {
    const user = await this.findOne({
      email,
    });

    if (!user) throw new NotFoundException('user.USER_NOT_FOUND');

    if (user.confirmEmail)
      throw new NotFoundException(`user.USER_ALREADY_APPROVED`);

    const confirmation = await this.confirmationService.findOne({
      email,
      code,
    });
    if (!confirmation)
      throw new HttpException(
        'user.CODE_OR_EMAIL_NOT_FOUND',
        HttpStatus.BAD_REQUEST,
      );

    if (confirmation.expiresAt.getTime() < new Date().getTime()) {
      await this.confirmationService.delete(confirmation);
      throw new HttpException('user.CODE_EXPIRED', HttpStatus.BAD_REQUEST);
    }

    return {
      user,
      confirmation,
    };
  }

  async confirmEmail(email, code) {
    const checkMailKey = await this.checkMailKey(email, code);
    const user = checkMailKey.user;
    user.confirmEmail = true;
    await this.update(user);
    return {
      message: 'user.VERIFIED_SUCCESSFULLY',
    };
  }

  async resendConfirmationMail(email, locale) {
    const user = await this.findOne({ email });
    if (!user) throw new NotFoundException(`user.USER_NOT_FOUND`);
    if (user.confirmEmail)
      throw new NotFoundException(`user.USER_ALREADY_APPROVED`);

    return {
      data: await this.mailService.sendMailConfirmationCode(user, locale),
    };
  }

  async removeUser(id: number) {
    const userToRemove = await this.findUserById(id);
    return await this.usersRepository.remove(userToRemove);
  }

  async softDeleteUser(id: number) {
    const user = await this.findOneById(id);
    if (!user)
      throw new HttpException(`user.USER_NOT_FOUND`, HttpStatus.NOT_FOUND);

    return await this.usersRepository.softDelete(id);
  }

  async deleteUser(id: number) {
    return await this.usersRepository.delete(id);
  }

  async updateUserProfilePicture(salt, path) {
    const user = await this.usersRepository.findOne({ salt });
    user.profilePicture = path;
    return await this.usersRepository.save(user);
  }

  async removeUserProfilePicture(id) {
    const user = await this.usersRepository.findOne(id);
    if (!user.profilePicture)
      throw new NotFoundException(`Profile picture not found`);

    // const deletePath = path.join(
    //   `${process.env.PUBLIC_PATH}/profilepictures`,
    //   `/${user.profilePicture}`,
    // );

    // if (fs.existsSync(deletePath)) fs.unlinkSync(deletePath);

    user.profilePicture = null;
    return await this.usersRepository.save(user);
  }

  async linkAccount(type: string, id: number) {
    const user = await this.usersRepository.findOne(id);

    user[type] = true;

    await this.usersRepository.save(user);
  }

  async unlinkAccount(type: string, id: number) {
    const user = await this.usersRepository.findOne(id);

    user[type] = false;

    return await this.usersRepository.save(user);
  }
}
