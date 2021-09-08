import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateStoryDto } from '../dto/update-story.dto';
import { StorySectionService } from './sections.service';
import { StoriesRepository } from '../stories.repository';
import { StatisticService } from '../../statistic/statistic.service';
import { Story } from '../entities/story.entity';
import { TitlePageDto } from '../dto/title-page.dto';
import { QuizPageDto } from '../dto/quiz-page.dto';
import { NormalPageDto } from '../dto/normal-page.dto';
import { PodcastPageDto } from '../dto/podcast-page.dto';
import { ButtonPageDto } from '../dto/button-page.dto';
import { PageTypeService } from './page-types.service';

const dto = {
  Title: TitlePageDto,
  Quiz: QuizPageDto,
  Normal: NormalPageDto,
  Audio: PodcastPageDto,
  Button: ButtonPageDto,
};

@Injectable()
export class StoriesService {
  constructor(
    private readonly storySectionService: StorySectionService,
    private readonly statisticService: StatisticService,
    private readonly storyRepository: StoriesRepository,
    private readonly pageTypeService: PageTypeService,
  ) {}

  async create(story) {
    console.log(story);
    const page = await this.storyRepository.save(story);
    delete page.creatorUser;
    return { data: page };
  }

  async findAll() {
    return {
      data: await this.storyRepository.find(),
    };
  }

  async find(data: object) {
    return await this.storyRepository.find(data);
  }

  async findUsersStories(userId: number, orderBy: string) {
    const stories = await this.storyRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const storiesWithTitle = await Promise.all(
      stories.map(async (story) => {
        {
          const sections = await this.storySectionService.findAllById(story.id);

          return {
            id: story.id,
            title: sections[0].title,
            views: await this.statisticService.findOneWithPageId(
              sections[0].titlePageId,
              'view',
            ),
            createdAt: story.createdAt.toLocaleDateString('tr'),
            updatedAt: story.updatedAt.toLocaleDateString('tr'),
          };
        }
      }),
    );

    if (orderBy == 'popular') {
      storiesWithTitle.sort((a, b) => (b.views > a.views ? 1 : -1));
    }

    return storiesWithTitle;
  }
  async findOne(story2) {
    const story = await this.storyRepository.findOne({
      where: { id: story2 },
      relations: ['section'],
    });
    if (!story) {
      throw new HttpException(
        `story.NOT_FOUND{id:${story2}}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const sections = await this.storySectionService.findAllById(story.id);
    const title = sections[0].title;
    return { title, ...story };
  }

  async update(id: number, updateStoryDto: UpdateStoryDto) {
    const updatedStory = await this.storyRepository.preload({
      id,
      ...updateStoryDto,
    });
    if (!updatedStory) {
      throw new NotFoundException(`story.NOT_FOUND{id:${id}}`);
    }
    return { data: await this.storyRepository.save(updatedStory) };
  }

  async remove(id: number) {
    const story = await this.storyRepository.findOne(id);
    if (!story) {
      throw new NotFoundException(`story.NOT_FOUND{id:${id}}`);
    }
    return await this.storyRepository.softDelete(id);
  }

  async duplicate(id: number) {
    const story = await this.storyRepository
      .findOne(+id, {
        relations: ['section'],
      })
      .then((story) => {
        delete story.id;
        delete story.createdAt;
        return story;
      });

    if (!story) {
      throw new NotFoundException(`story.NOT_FOUND{id:${id}}`);
    }

    const { section } = story;

    const newSections = [];
    const duplicatedStory: Story = story;

    for (const s of section) {
      const { id, storyId, story, ...sectionWithPage } =
        await this.storySectionService.findOneById(s.id);
      const pages = JSON.parse(JSON.stringify(sectionWithPage.page));
      sectionWithPage.page = [];
      for (const page of pages) {
        const { id, sectionId, ...rest } = page;
        const type = await this.pageTypeService.findOne(rest.typeId);
        const newPage = new dto[type.code](rest);
        sectionWithPage.page.push(newPage);
      }
      newSections.push(sectionWithPage);
      duplicatedStory.section = newSections;
    }

    const newStory = await this.storyRepository.save(duplicatedStory);

    return {
      id: newStory.id,
      title: newStory.section[0].page[0].title,
      createdAt: newStory.createdAt.toLocaleDateString('tr'),
      updatedAt: newStory.updatedAt.toLocaleDateString('tr'),
    };
  }
}
