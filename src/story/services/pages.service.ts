import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryPage } from '../entities/page.entity';
import { TitlePageDto } from '../dto/title-page.dto';
import { QuizPageDto } from '../dto/quiz-page.dto';
import { NormalPageDto } from '../dto/normal-page.dto';
import { ButtonPageDto } from '../dto/button-page.dto';
import { PodcastPageDto } from '../dto/podcast-page.dto';

const dto = {
  Title: TitlePageDto,
  Quiz: QuizPageDto,
  Normal: NormalPageDto,
  Audio: PodcastPageDto,
  Button: ButtonPageDto,
};

@Injectable()
export class StoryPageService {
  constructor(
    @InjectRepository(StoryPage)
    private readonly storyPageRepository: Repository<StoryPage>,
  ) {}

  async create(data) {
    const newPage = await this.storyPageRepository.save(data);
    const c = await this.storyPageRepository.findOne(
      { id: newPage.id },
      {
        relations: ['quizChoices', 'type'],
      },
    );
    const page = new dto[c.type.code](c);
    return page;
  }

  async find(data: object) {
    return await this.storyPageRepository.find(data);
  }

  async findAllById(id) {
    const pages = await this.storyPageRepository.find({
      where: {
        sectionId: id,
      },
      relations: ['type'],
    });

    const modifiedPages = pages.map((page) => new dto[page.type.code](page));

    modifiedPages.map((page) => delete page.title);

    return { modifiedPages };
  }

  async findOneById(id: number) {
    const page = await this.storyPageRepository.findOne(id, {
      relations: ['type'],
    });
    if (!page) {
      throw new HttpException(
        `story.PAGE_NOT_FOUND{id:${id}}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const pageDto = new dto[page.type.code](page);
    return pageDto;
  }

  async softDelete(id: number) {
    const page = await this.storyPageRepository.findOne(id);

    if (!page)
      throw new HttpException(`story.PAGE_NOT_FOUND`, HttpStatus.NOT_FOUND);

    return await this.storyPageRepository.softDelete(id);
  }

  async update(id: number, data) {
    const page = await this.storyPageRepository.findOne(id, {
      relations: ['type'],
    });

    if (!page) throw new NotFoundException(`story.PAGE_NOT_FOUND`);

    const type = page.type.code;

    await this.storyPageRepository.save({
      id,
      sectionId: page.sectionId,
      ...data,
      position: page.position,
    });

    const newPage = await this.storyPageRepository.findOne(id);
    const updatedPage = new dto[type](newPage);
    return { data: updatedPage };
  }

  async changePagePosition(id: number, direction: number) {
    const page = await this.storyPageRepository.findOne(id);
    const currentPosition = page.position;
    const pageCount = (
      await this.storyPageRepository.find({
        sectionId: page.sectionId,
      })
    ).length;
    const pagePosition = direction + page.position;

    if (
      pagePosition >= pageCount ||
      pagePosition < 1 ||
      page.movable == false
    ) {
      return { statusCode: 400, message: 'story.PAGE_CANNOT_MOVE' };
    }

    if (pagePosition == pageCount) page.movable = false;

    const sectionId = page.sectionId;
    const neighbour = await this.storyPageRepository.findOne({
      position: pagePosition,
      sectionId,
    });

    await this.storyPageRepository.update(page.id, {
      position: pagePosition,
      sectionId,
    });
    await this.storyPageRepository.update(neighbour.id, {
      position: currentPosition,
      sectionId,
    });

    return { statusCode: 200 };
  }
}
