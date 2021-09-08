import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Story } from './entities/story.entity';
import { StorySection } from './entities/section.entity';
import { StoryPage } from './entities/page.entity';
import slugify from 'slugify';
import { QuizChoice } from './entities/choice.entity';
import { PageType } from './entities/page-type.entity';

@EventSubscriber()
export class StoryPageSubscriber
  implements EntitySubscriberInterface<StoryPage>
{
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return StoryPage;
  }

  async beforeInsert(event: InsertEvent<StoryPage>) {
    const newPage = event.entity;
    const sectionId = newPage.sectionId;

    const type = await event.manager
      .getRepository(PageType)
      .findOne(newPage.typeId);

    //newCard.type = type;

    const samePageCount = (
      await event.manager.getRepository(StoryPage).find({
        sectionId,
      })
    ).length;
    event.entity.position = samePageCount;

    if (type.code == 'Title') return;
  }

  async afterInsert(event: InsertEvent<StoryPage>) {
    const newPage = event.entity;
    const type = await event.manager
      .getRepository(PageType)
      .findOne(newPage.typeId);
    if (type.code == 'Quiz') {
      await event.manager.getRepository(QuizChoice).save([
        { isCorrect: true, cardId: newPage.id },
        { isCorrect: false, cardId: newPage.id },
      ]);
    }
    const storyId = (
      await event.manager
        .getRepository(StorySection)
        .findOne({ id: newPage.sectionId })
    ).storyId;

    await event.manager.getRepository(StorySection).update(newPage.sectionId, {
      storyId,
      updatedAt: new Date(Date.now()),
    });
  }

  async beforeUpdate(event: UpdateEvent<StoryPage>) {
    if (!event.entity) return;

    const page = event.entity;
    const section = await event.manager
      .getRepository(StorySection)
      .findOne(page.sectionId);

    await event.manager.getRepository(StorySection).update(section.id, {
      storyId: section.storyId,
      updatedAt: new Date(Date.now()),
    });

    if (page.position != 0) return;

    const slug = slugify(page.title);

    const story = await event.manager.getRepository(Story).findOne({
      id: section.storyId,
    });

    const sameSlugsCount = (
      await event.manager
        .getRepository(Story)
        .createQueryBuilder('story')
        .where('story.slug like :slug AND story.userId = :userId', {
          slug,
          userId: story.userId,
        })
        .getMany()
    ).length;

    await event.manager.getRepository(Story).save({
      id: section.storyId,
      slug: sameSlugsCount > 0 ? `${slug}${sameSlugsCount + 1}` : slug,
    });
  }
}
