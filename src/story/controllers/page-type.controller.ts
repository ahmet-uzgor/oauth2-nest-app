import { Body, Controller, Get, Headers, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UpdatePageTypeDto } from '../dto/update-page-type.dto';
import { PageTypeService } from '../services/page-types.service';

@ApiTags('Page Types')
@Controller('page-types')
@ApiHeader({ name: 'locale' })
export class PageTypeController {
  constructor(private readonly pageTypeService: PageTypeService) {}
  //@Roles(Role.ADMIN)
  // @Post()
  // @ApiBearerAuth()
  // async create(@Body() cardType: CreatePageTypeDto) {
  //   try {
  //     return { data: await this.cardTypeService.create(cardType) };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @Get()
  @ApiBearerAuth()
  @ApiHeader({ name: 'locale' })
  async findAll(@Headers('locale') locale: any) {
    return await this.pageTypeService.findAll(locale);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiHeader({ name: 'locale' })
  async findOne(@Param('id') id: string, @Headers('locale') locale: any) {
    return {
      data: await this.pageTypeService.findOneWhereByLocale(id, locale),
    };
  }

  @Put(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updatePageTypeDto: UpdatePageTypeDto,
  ) {
    return await this.pageTypeService.update(parseInt(id), updatePageTypeDto);
  }

  // @Delete(':id')
  // @ApiBearerAuth()
  // async remove(@Param('id') id: string) {
  //   return await this.pageTypeService.remove(parseInt(id));
  // }
}
