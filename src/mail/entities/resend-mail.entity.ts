import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendMailDto {
  @ApiProperty()
  @IsEmail({}, { message: 'mail.INVALID_EMAIL' })
  @IsNotEmpty({ message: 'mail.NOT_EMPTY_EMAIL' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'mail.NOT_EMPTY_CODE' })
  readonly code: string;
}
