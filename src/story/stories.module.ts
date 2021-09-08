import { Module } from '@nestjs/common';
import { StoriesService } from './services/stories.service';
import { StoriesController } from './stories.controller';
import { PageTypeService } from './services/page-types.service';
import { PageType } from './entities/page-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import { StorySection } from './entities/section.entity';
import { StoryPage } from './entities/page.entity';
import { StorySectionService } from './services/sections.service';
import { StoryPageService } from './services/pages.service';
import { StoriesSubscriber } from './stories.subscriber';
import { StoriesRepository } from './stories.repository';
import { PageTypeController } from './controllers/page-type.controller';
import { PageTypeTranslation } from './entities/page-type-translation.entity';
import { PageTypeTranslationRepository } from './repositories/page-type.repository';
import { StoryPageSubscriber } from './pages.subscriber';
import { StorySectionSubscriber } from './sections.subscriber';
import { QuizChoice } from './entities/choice.entity';
import { StatisticModule } from '../statistic/statistic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Story,
      PageType,
      PageTypeTranslation,
      StorySection,
      StoryPage,
      QuizChoice,
      StoriesRepository,
      PageTypeTranslationRepository,
    ]),
    StatisticModule,
  ],
  controllers: [StoriesController, PageTypeController],
  providers: [
    StoriesService,
    PageTypeService,
    StorySectionService,
    StoryPageService,
    StoriesSubscriber,
    StoryPageSubscriber,
    StorySectionSubscriber,
  ],
  exports: [PageTypeService, StoriesService],
})
export class StoriesModule {}
