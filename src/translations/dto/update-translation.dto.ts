import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTranslationDto } from './create-translation.dto';
import { IsOptional } from 'class-validator';
import { CreateTranslateTranslationDto } from './create-translate-translation.dto';

export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {
  @ApiProperty()
  @IsOptional()
  key: string;

  @ApiProperty({
    type: CreateTranslateTranslationDto,
    isArray: true,
  })
  readonly translateTranslations: CreateTranslateTranslationDto[];
}
