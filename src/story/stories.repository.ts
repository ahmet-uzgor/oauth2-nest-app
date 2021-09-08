import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Story } from './entities/story.entity';

@EntityRepository(Story)
export class StoriesRepository extends Repository<Story> {
  async getStory(id: number) {
    return await getRepository(Story)
      .createQueryBuilder('story')
      .innerJoinAndSelect('story.section', 'sections')
      .innerJoinAndSelect('sections.page', 'pages')
      .where('story.id = :id', {
        id,
      })
      .printSql()
      .getOne();
  }
}
