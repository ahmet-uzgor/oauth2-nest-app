import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { TranslationsService } from './translations.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { CreateTranslateTranslationDto } from './dto/create-translate-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('translations')
@ApiTags('Translations')
@ApiHeader({ name: 'locale' })
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @ApiBearerAuth()
  @Post()
  async create(@Body() createTranslationDto: CreateTranslationDto) {
    return {
      data: await this.translationsService.create(createTranslationDto),
    };
  }

  @ApiBearerAuth()
  @Post('translate-translation')
  createTranslateTranslation(
    @Body() createTranslateTranslationDto: CreateTranslateTranslationDto,
  ) {
    return this.translationsService.createTranslateTranslation(
      createTranslateTranslationDto,
    );
  }

  @ApiBearerAuth()
  @Get()
  async findAll(@I18n() i18n: I18nContext, @Headers('locale') locale: any) {
    console.log(locale);
    const message = await i18n.translate('user.HELLO_MESSAGE', {
      args: { username: 'Toon' },
    });
    console.log(message);
    return this.translationsService.findAll(locale);
  }

  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { data: await this.translationsService.findOne(+id) };
  }

  @ApiBearerAuth()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: UpdateTranslationDto,
  ) {
    return this.translationsService.update(+id, updateTranslationDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.translationsService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
