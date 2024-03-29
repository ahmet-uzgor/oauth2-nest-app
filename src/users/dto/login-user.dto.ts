import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../entities/user.entity';

export class LoginUserDto extends User {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
