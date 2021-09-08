import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Slider } from './slider.entity';

@Entity()
export class TranslateSlider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  locale: string;

  @ManyToOne(() => Slider, (slider) => slider.translateSliders)
  slider: Slider;
}
