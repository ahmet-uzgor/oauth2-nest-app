import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'The refresh token is required' })
  readonly refreshToken: string;
}
