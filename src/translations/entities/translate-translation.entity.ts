import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Translation } from './translation.entity';

@Entity()
export class TranslateTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  locale: string;

  @ManyToOne(
    () => Translation,
    (translation) => translation.translateTranslations,
  )
  translation: Translation;
}
