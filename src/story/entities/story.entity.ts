import { User } from '../../users/entities/user.entity';
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
import { StorySection } from './section.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  locale: string;

  @Column({ nullable: true })
  slug: string;

  @Exclude()
  @Column()
  userId: number;

  @Exclude()
  @ManyToOne(() => User, (user) => user.stories)
  @JoinColumn({ name: 'userId' })
  creatorUser: User;

  @OneToMany(() => StorySection, (section) => section.story, { cascade: true })
  section: StorySection[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  // @BeforeUpdate()
  // public setUpdatedAt() {
  //   this.updatedAt = new Date(Date.now());
  // }
}
