import { ApiProperty } from '@nestjs/swagger';
import { CreatePageTypeTranslationDto } from './create-page-type-translation.dto';
import { IsNotEmpty } from 'class-validator';

export class CreatePageTypeDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A key is required',
  })
  key: string;

  @ApiProperty({
    type: CreatePageTypeTranslationDto,
    isArray: true,
  })
  readonly translations: CreatePageTypeTranslationDto[];
}
