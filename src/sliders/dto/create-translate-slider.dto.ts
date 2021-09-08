import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TranslateSlider } from '../entities/translate-slider.entity';
import { Slider } from '../entities/slider.entity';

export class CreateTranslateSliderDto extends TranslateSlider {
  @ApiProperty()
  @IsNotEmpty({
    message: 'A title is required',
  })
  readonly title: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'A locale is required',
  })
  readonly locale: string;
}
