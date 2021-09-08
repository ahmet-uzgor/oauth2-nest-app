import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StoryPage } from './page.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class QuizChoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  choice: string;

  @Column()
  isCorrect: boolean;

  @Exclude()
  @Column()
  pageId: number;

  @ManyToOne(() => StoryPage, (page) => page.quizChoices)
  @JoinColumn({ name: 'pageId' })
  page: StoryPage;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(isCorrect: boolean) {
    this.isCorrect = isCorrect;
  }
}
