import { ApiProperty } from '@nestjs/swagger';
import { CreateTranslateSliderDto } from './create-translate-slider.dto';

export class CreateSliderDto {
  @ApiProperty({
    type: CreateTranslateSliderDto,
    isArray: true,
  })
  readonly translateSliders: CreateTranslateSliderDto;
}
