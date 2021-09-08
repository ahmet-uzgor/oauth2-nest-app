import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserMeDto {
  @ApiProperty()
  @IsOptional()
  // @MinLength(3, { message: 'user.NAME_MIN_LENGTH{length:3}' })
  // @MaxLength(100, { message: 'user.NAME_MAX_LENGTH{length:100}' })
  name: string;

  @ApiProperty()
  @IsOptional()
  // @MinLength(3, { message: 'user.SURNAME_MIN_LENGTH{length:3}' })
  // @MaxLength(100, { message: 'user.SURNAME_MAX_LENGTH{length:100}' })
  surname: string;
}
