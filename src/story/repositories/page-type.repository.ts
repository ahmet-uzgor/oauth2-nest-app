import { EntityRepository, getRepository, Repository } from 'typeorm';
import { PageTypeTranslation } from '../entities/page-type-translation.entity';

@EntityRepository(PageTypeTranslation)
export class PageTypeTranslationRepository extends Repository<PageTypeTranslation> {
  async getAllTranslations(locale: any) {
    return await getRepository(PageTypeTranslation)
      .createQueryBuilder('pageTypeTranslation')
      .leftJoin('pageTypeTranslation.translatable', 'translatable')
      .where(
        'pageTypeTranslation.locale = :locale AND pageTypeTranslation.translatableId IS NOT NULL',
        {
          locale,
        },
      )
      .select('translatable.code', 'key')
      .addSelect('pageTypeTranslation.name', 'value')
      .printSql()
      .getRawMany();
  }

  async getTranslation(id: any, locale: any) {
    return await getRepository(PageTypeTranslation)
      .createQueryBuilder('pageTypeTranslation')
      .leftJoin('pageTypeTranslation.translatable', 'translatable')
      .where('pageTypeTranslation.locale = :locale AND translatable.id = :id', {
        locale,
        id,
      })
      .select('translatable.code', 'key')
      .addSelect('pageTypeTranslation.name', 'value')
      .printSql()
      .getRawOne();
  }
}
