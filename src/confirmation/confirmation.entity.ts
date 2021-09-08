import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_confirmations')
export class Confirmation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  code: string;

  @Column({
    nullable: false,
    type: 'timestamp',
  })
  expiresAt: Date;
}
