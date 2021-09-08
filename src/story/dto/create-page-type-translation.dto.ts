import { PageTypeTranslation } from '../entities/page-type-translation.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePageTypeTranslationDto extends PageTypeTranslation {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A value is required',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'A locale is required',
  })
  locale: string;
}
