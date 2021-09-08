import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Story } from '../../story/entities/story.entity';

export class CheckEmailDto {
  @ApiProperty()
  @IsEmail({}, { each: true, message: 'user.INVALID_EMAIL' })
  emails: [];

  @ApiProperty()
  story: Story;
}
