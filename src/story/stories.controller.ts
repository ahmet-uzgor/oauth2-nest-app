import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StoriesService } from './services/stories.service';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StorySectionService } from './services/sections.service';
import { StoryPageService } from './services/pages.service';
import { CreateStoryPageDto } from './dto/create-story-page.dto';
import { UpdateStoryPageDto } from './dto/update-story-page.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Story')
@Controller('stories')
@ApiHeader({ name: 'locale' })
export class StoriesController {
  constructor(
    private readonly storiesService: StoriesService,
    private readonly sectionService: StorySectionService,
    private readonly pageService: StoryPageService,
  ) {}

  @Post()
  @ApiBearerAuth()
  async create(@CurrentUser() user) {
    try {
      return await this.storiesService.create({ creatorUser: user });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @Public()
  async findAll() {
    return await this.storiesService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    try {
      return { data: await this.storiesService.findOne(+id) };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateStoryDto: UpdateStoryDto) {
    return this.storiesService.update(+id, updateStoryDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storiesService.remove(+id);
  }

  @ApiBearerAuth()
  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string) {
    return { data: await this.storiesService.duplicate(+id) };
  }

  @ApiBearerAuth()
  @Post(':id/section')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async createSection(@Param('id') id: number) {
    try {
      return {
        data: await this.sectionService.create({
          storyId: id,
        }),
      };
    } catch (error) {
      throw new HttpException(`story.NOT_FOUND`, HttpStatus.BAD_REQUEST);
    }
  }

  // @Get('chapters/:id')
  // @Public()
  // @ApiParam({
  //   name: 'id',
  //   required: true,
  // })
  // async getChapters(@Param('id') id: number) {
  //   try {
  //     return { data: await this.chapterService.findAllById(id) };
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }

  @ApiBearerAuth()
  @Delete('sections/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async deleteSection(@Param('id') id: number) {
    try {
      return await this.sectionService.softDelete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Put('/section/:id/position')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiQuery({
    name: 'directory',
    required: true,
  })
  async changeSectionPosition(
    @Param('id') id: number,
    @Query('directory') directory: number,
  ) {
    const accessDirectory = [-1, 1];
    if (!accessDirectory.includes(+directory))
      return { statusCode: 400, message: 'story.UNKNOWN_DIRECTORY_TYPE' };
    return await this.sectionService.changeSectionPosition(id, +directory);
  }

  @ApiBearerAuth()
  @Get('sections/:id/pages')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async getPages(@Param('id') id: number) {
    try {
      return { data: await this.pageService.findAllById(id) };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Post('sections/:id/page')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async createPage(
    @Param('id') id: number,
    @Body() createStoryPageDto: CreateStoryPageDto,
  ) {
    try {
      return {
        data: await this.pageService.create({
          sectionId: id,
          ...createStoryPageDto,
        }),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Get('pages/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async getPage(@Param('id') id: number) {
    try {
      return { data: await this.pageService.findOneById(id) };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Delete('/pages/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async deletePage(@Param('id') id: number) {
    return await this.pageService.softDelete(id);
  }

  @ApiBearerAuth()
  @Put('/pages/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  async updatePage(
    @Param('id') id: string,
    @Body() updateStoryPageDto: UpdateStoryPageDto,
  ) {
    try {
      return await this.pageService.update(+id, updateStoryPageDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @Put('/page/:id/position')
  @ApiParam({
    name: 'id',
    required: true,
  })
  @ApiQuery({
    name: 'directory',
    required: true,
  })
  async changePagePosition(
    @Param('id') id: number,
    @Query('directory') directory: number,
  ) {
    try {
      const accessDirectory = [-1, 1];
      if (!accessDirectory.includes(+directory))
        return { statusCode: 400, message: 'story.UNKNOWN_DIRECTORY_TYPE' };
      return await this.pageService.changePagePosition(id, +directory);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
