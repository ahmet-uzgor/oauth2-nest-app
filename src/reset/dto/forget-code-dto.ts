import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgotCodeCheckDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'user.NOT_EMPTY' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'user.NOT_EMPTY' })
  readonly token: number;
}
