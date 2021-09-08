import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../entities/user.entity';
import { IsUserAlreadyExist } from './validations/IsUserAlreadyExist';

export class CreateUserDto extends User {
  @ApiProperty()
  @MinLength(3, { message: 'user.NAME_MIN_LENGTH{length:3}' })
  @MaxLength(100, { message: 'user.NAME_MAX_LENGTH{length:100}' })
  @IsString({ message: 'user.NAME_IS_STRING' })
  name: string;

  @ApiProperty()
  @MinLength(3, { message: 'user.SURNAME_MIN_LENGTH{length:3}' })
  @MaxLength(100, { message: 'user.SURNAME_MAX_LENGTH{length:100}' })
  @IsString({ message: 'user.SURNAME_IS_STRING' })
  surname: string;

  @ApiProperty()
  @IsEmail({}, { message: 'user.INVALID_EMAIL' })
  @MinLength(5, { message: 'user.EMAIL_MIN_LENGTH{length:5}' })
  @MaxLength(100, { message: 'user.EMAIL_MAX_LENGTH{length:100}' })
  @IsUserAlreadyExist({
    message: 'user.IS_USER_EMAIL_ALREADY_EXIST{email:$value}',
  })
  email: string;

  @ApiProperty()
  @MinLength(8, { message: 'user.PASSWORD_MIN_LENGTH{length:5}' })
  @MaxLength(30, { message: 'user.PASSWORD_MAX_LENGTH{length:30}' })
  @IsString({ message: 'user.PASSWORD_IS_STRING' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*?[#?!@$%^&*-+_.])(?=.*[a-z]).*$/,
    {
      message: 'user.PASSWORD_RULES',
    },
  )
  password: string;
}
