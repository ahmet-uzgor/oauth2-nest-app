import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TranslateTranslation } from './translate-translation.entity';

@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @OneToMany(
    () => TranslateTranslation,
    (translateTranslation) => translateTranslation.translation,
    {
      cascade: true,
    },
  )
  translateTranslations: TranslateTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
