import { StoryPage } from 'src/story/entities/page.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  trackId: string;

  @Column()
  userType: string;

  @Column()
  event: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  pageId: number;

  @ManyToOne(() => StoryPage, (page) => page.id, { nullable: true })
  @JoinColumn({ name: 'pageId' })
  page: StoryPage;

  @Column({ nullable: true })
  selectedId: string;

  @Column({ nullable: true })
  durationTime: number;

  @CreateDateColumn()
  eventTime: Date;
}
