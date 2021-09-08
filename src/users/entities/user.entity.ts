import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../enums/role.enums';
import { RefreshToken } from '../../auth/refresh-token/entities/refresh-token.entity';
import { Story } from '../../story/entities/story.entity';
import { Provider } from '../enums/user-provider.enums';
import { LinkAccount } from './link-account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.DEFAULT,
  })
  provider: Provider;

  @OneToMany(() => LinkAccount, (linkAccount) => linkAccount.user, {
    onDelete: 'CASCADE',
  })
  linkAccounts: LinkAccount[];

  @Column({ nullable: true })
  profilePicture: string;

  @Column({
    type: 'set',
    enum: Role,
  })
  roles: Role[];

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
  })
  public refreshTokens: RefreshToken[];

  @OneToMany(() => Story, (course) => course.creatorUser, {
    onDelete: 'CASCADE',
  })
  stories: Story[];

  @Column({ nullable: true })
  @Exclude()
  salt: string;

  public jwtPayload() {
    return {
      salt: this.salt,
    };
  }

  @Column({ default: false })
  @Exclude()
  confirmEmail: boolean;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
