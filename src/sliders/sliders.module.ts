import { Module } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slider } from './entities/slider.entity';
import { TranslateSlider } from './entities/translate-slider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slider, TranslateSlider])],
  controllers: [SlidersController],
  providers: [SlidersService],
})
export class SlidersModule {}
