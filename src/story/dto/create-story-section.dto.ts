import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { StorySection } from '../entities/section.entity';
import { Story } from '../entities/story.entity';

export class CreateStorySectionDto extends StorySection {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A value is required',
  })
  readonly story: Story;
}
