import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PageType } from './page-type.entity';

@Entity()
export class PageTypeTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  locale: string;

  @ManyToOne(() => PageType, (pageType) => pageType.translations)
  translatable: PageType;
}
