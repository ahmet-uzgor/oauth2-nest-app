import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('sliders')
@ApiTags('Sliders')
@ApiHeader({ name: 'locale' })
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Post()
  create(@Body() createSliderDto: CreateSliderDto) {
    return this.slidersService.create(createSliderDto);
  }

  @Get()
  findAll() {
    return this.slidersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slidersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSliderDto: UpdateSliderDto) {
    return this.slidersService.update(+id, updateSliderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slidersService.remove(+id);
  }
}
