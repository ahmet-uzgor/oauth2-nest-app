import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TranslateTranslation } from '../entities/translate-translation.entity';
export class CreateTranslateTranslationDto extends TranslateTranslation {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A value is required',
  })
  readonly value: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'A locale is required',
  })
  readonly locale: string;
}
