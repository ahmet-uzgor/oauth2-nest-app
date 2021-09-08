import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoryPage } from './page.entity';
import { PageTypeTranslation } from './page-type-translation.entity';

@Entity()
export class PageType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @OneToMany(
    () => PageTypeTranslation,
    (translation) => translation.translatable,
    {
      cascade: true,
    },
  )
  translations: PageTypeTranslation[];

  @OneToMany(() => StoryPage, (page) => page.type)
  pages: StoryPage[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
