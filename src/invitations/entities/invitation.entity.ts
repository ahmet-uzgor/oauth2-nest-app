import { Story } from '../../story/entities/story.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @ManyToOne(() => Story, (story) => story.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  story: Story;

  @Column({ default: false })
  isAccepted: boolean;

  @Column()
  token: string;

  @Column({ default: false })
  revoke: boolean;
}
