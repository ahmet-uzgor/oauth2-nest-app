import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserProfilePictureDto {
  @ApiProperty()
  @IsOptional()
  profilePicture: string;
}
