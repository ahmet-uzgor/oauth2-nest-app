import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { StorySection } from './entities/section.entity';
import { StoryPage } from './entities/page.entity';
import { PageType } from './entities/page-type.entity';
import { Story } from './entities/story.entity';

@EventSubscriber()
export class StorySectionSubscriber
  implements EntitySubscriberInterface<StorySection>
{
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return StorySection;
  }

  async beforeInsert(event: InsertEvent<StorySection>) {
    const newSection = event.entity;
    const storyId = newSection.storyId;
    const sameSectionCount = (
      await event.manager.getRepository(StorySection).find({
        storyId,
      })
    ).length;
    event.entity.position = sameSectionCount;
  }

  async afterInsert(event: InsertEvent<StorySection>) {
    const storyId = event.entity.storyId;
    const titlePageType = await event.manager.getRepository(PageType).findOne({
      code: 'Title',
    });
    const page = new StoryPage(event.entity, 0, false, titlePageType);
    await event.manager.getRepository(StoryPage).save(page);

    await event.manager.getRepository(Story).update(storyId, {
      updatedAt: new Date(Date.now()),
    });
  }

  async beforeUpdate(event: UpdateEvent<StorySection>) {
    if (!event.entity) return;
    await event.manager.getRepository(Story).update(event.entity.storyId, {
      updatedAt: new Date(Date.now()),
    });
  }
}
