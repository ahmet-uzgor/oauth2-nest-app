import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @MinLength(8, { message: 'user.EMAIL_MIN_LENGTH{length:5}' })
  @MaxLength(30, { message: 'user.EMAIL_MAX_LENGTH{length:30}' })
  @IsNotEmpty({ message: 'user.NOT_EMPTY' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'user.PASSWORD_RULES',
  })
  readonly password: string;
}
