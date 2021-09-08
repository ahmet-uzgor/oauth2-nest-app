import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TranslateSlider } from './translate-slider.entity';

@Entity()
export class Slider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(
    () => TranslateSlider,
    (translateSlider) => translateSlider.slider,
    {
      cascade: true,
    },
  )
  translateSliders: TranslateSlider[];
}
