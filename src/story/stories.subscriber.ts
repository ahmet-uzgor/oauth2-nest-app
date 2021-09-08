import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Story } from './entities/story.entity';
import { StorySection } from './entities/section.entity';

@EventSubscriber()
export class StoriesSubscriber implements EntitySubscriberInterface<Story> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Story;
  }

  async afterInsert(event: InsertEvent<Story>) {
    if (!event.entity.section) {
      const section = new StorySection(event.entity, 0, false);
      await event.manager.getRepository(StorySection).save(section);
    }
  }
}
