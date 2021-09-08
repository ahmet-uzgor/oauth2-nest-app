import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfirmationMailDto {
  @ApiProperty()
  @IsEmail({}, { message: 'mail.INVALID_EMAIL' })
  @IsNotEmpty({ message: 'mail.NOT_EMPTY_EMAIL' })
  readonly email: string;
}
