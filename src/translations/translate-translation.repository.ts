import { EntityRepository, getRepository, Repository } from 'typeorm';
import { TranslateTranslation } from './entities/translate-translation.entity';

@EntityRepository(TranslateTranslation)
export class TranslateTranslationRepository extends Repository<TranslateTranslation> {
  async getAllTranslateTranslations(locale: any) {
    return await getRepository(TranslateTranslation)
      .createQueryBuilder('translateTranslation')
      .leftJoin('translateTranslation.translation', 'translation')
      .where('translateTranslation.locale = :locale', {
        locale,
      })
      .select('translateTranslation.value', 'value')
      .addSelect('translation.key', 'key')
      .printSql()
      .getRawMany();
  }
}
