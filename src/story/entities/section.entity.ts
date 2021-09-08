import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoryPage } from './page.entity';
import { Story } from './story.entity';

@Entity()
export class StorySection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  movable: boolean;

  @Column({ nullable: true })
  position: number;

  @Column()
  storyId: number;

  @ManyToOne(() => Story, (story) => story.section)
  @JoinColumn({ name: 'storyId' })
  story: Story;

  @OneToMany(() => StoryPage, (page) => page.section, { cascade: true })
  page: StoryPage[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(story: Story, position: number, movable: boolean) {
    this.story = story;
    this.position = position;
    this.movable = movable;
  }
}
