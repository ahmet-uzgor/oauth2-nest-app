import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendResetPasswordDto {
  @ApiProperty()
  @IsEmail({}, { message: 'user.INVALID_EMAIL' })
  @IsNotEmpty({ message: 'user.NOT_EMPTY' })
  readonly email: string;
}
