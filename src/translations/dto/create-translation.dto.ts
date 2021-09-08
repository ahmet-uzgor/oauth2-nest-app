import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateTranslateTranslationDto } from './create-translate-translation.dto';

export class CreateTranslationDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A key is required',
  })
  readonly key: string;

  @ApiProperty({
    type: CreateTranslateTranslationDto,
    isArray: true,
  })
  readonly translateTranslations: CreateTranslateTranslationDto[];
}
