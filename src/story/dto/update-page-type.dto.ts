import { PageType } from '../entities/page-type.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePageTypeTranslationDto } from './create-page-type-translation.dto';

export class UpdatePageTypeDto extends PageType {
  @ApiProperty({
    type: CreatePageTypeTranslationDto,
    isArray: true,
  })
  readonly translations: CreatePageTypeTranslationDto[];
}
