import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Story } from '../entities/story.entity';

export class CreateStoryDto extends Story {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A value is required',
  })
  readonly creatorUser: User;
}
