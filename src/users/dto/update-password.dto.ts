import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @MinLength(8, { message: 'user.PASSWORD_MIN_LENGTH{length:5}' })
  @MaxLength(30, { message: 'user.PASSWORD_MAX_LENGTH{length:30}' })
  @IsNotEmpty({ message: 'user.NOT_EMPTY' })
  @IsString({ message: 'user.PASSWORD_IS_STRING' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*?[#?!@$%^&*-+_.])(?=.*[a-z]).*$/,
    {
      message: 'user.PASSWORD_RULES',
    },
  )
  newPassword: string;
}
