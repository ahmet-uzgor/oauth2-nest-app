import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { getRepository } from 'typeorm';

@ValidatorConstraint()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor() {}
  async validate(email: string) {
    return await getRepository(User)
      .findOne({ email })
      .then((user) => {
        if (user) return false;
        return true;
      });
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
