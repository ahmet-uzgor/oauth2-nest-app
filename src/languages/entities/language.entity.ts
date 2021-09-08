import { ILanguage } from '../interfaces/languages.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'languages',
})
export class Language implements ILanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prefix: string;

  @Column()
  name: string;

  @Column()
  native_name: string;

  @Column()
  is_active: boolean;

  @Column()
  is_default: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
