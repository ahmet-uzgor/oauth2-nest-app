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
import { PageType } from './page-type.entity';
import { QuizChoice } from './choice.entity';

@Entity()
export class StoryPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  media_url: string;

  @Column({ nullable: true })
  button_name: string;

  @Column({ nullable: true })
  button_url: string;

  @Column({ default: true })
  titleVisible: boolean;

  @Column({ default: true })
  descriptionVisible: boolean;

  @Column({ default: false })
  isValid: boolean;

  @Column({ default: true })
  movable: boolean;

  @Column({ nullable: true })
  position: number;

  @Column()
  sectionId: number;

  @ManyToOne(() => StorySection, (section) => section.page, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sectionId' })
  section: StorySection;

  @OneToMany(() => QuizChoice, (choice) => choice.page)
  quizChoices: QuizChoice[];

  @Column()
  typeId: number;

  @ManyToOne(() => PageType, (type) => type.pages, {
    nullable: true,
  })
  @JoinColumn({ name: 'typeId' })
  type: PageType;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(
    section: StorySection = null,
    position: number = null,
    movable: boolean,
    type: PageType = null,
  ) {
    this.section = section;
    this.position = position;
    this.movable = movable;
    this.type = type;
  }
}
