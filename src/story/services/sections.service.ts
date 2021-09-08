import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorySection } from '../entities/section.entity';

@Injectable()
export class StorySectionService {
  constructor(
    @InjectRepository(StorySection)
    private readonly storySectionRepository: Repository<StorySection>,
  ) {}

  async create(section) {
    return await this.storySectionRepository.save(section);
  }

  async findAllById(id) {
    const data = await this.storySectionRepository.find({
      where: {
        storyId: id,
      },
      relations: ['page'],
    });

    if (data.length == 0) {
      throw new NotFoundException(`story.SECTION_NOT_FOUND{id:${id}}`);
    }

    const newData = await Promise.all(
      data.map(async (section) => {
        return {
          id: section.id,
          title: section.page[0].title,
          titlePageId: section.page[0].id,
          updatedAt: section.updatedAt,
        };
      }),
    );

    return newData;
  }

  async findOneById(id: number): Promise<StorySection> {
    return await this.storySectionRepository.findOne(id, {
      relations: ['page'],
    });
  }

  async updateChapter(id: number, data) {
    const section = await this.findOneById(id);
    if (!section) throw new NotFoundException(`story.SECTION_NOT_FOUND`);

    return await this.storySectionRepository.update(id, data);
  }

  async softDelete(id: number) {
    const section = await this.findOneById(id);
    if (!section)
      throw new HttpException(`story.SECTION_NOT_FOUND`, HttpStatus.NOT_FOUND);

    return await this.storySectionRepository.softDelete(id);
  }

  async changeSectionPosition(id: number, direction: number) {
    const story = await this.storySectionRepository.findOne(id);
    const currentPosition = story.position;
    const sectionCount = (
      await this.storySectionRepository.find({
        storyId: story.storyId,
      })
    ).length;
    const sectionPosition = direction + story.position;

    if (
      sectionPosition >= sectionCount ||
      sectionPosition < 1 ||
      story.movable == false
    ) {
      return { statusCode: 400, message: 'story.SECTION_CANNOT_MOVE' };
    }

    if (sectionPosition == sectionCount) story.movable = false;

    const neighbour = await this.storySectionRepository.findOne({
      position: sectionPosition,
    });

    neighbour.position = currentPosition;
    story.position = sectionPosition;

    await this.storySectionRepository.save(story);
    await this.storySectionRepository.save(neighbour);

    return { statusCode: 200 };
  }
}
