import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { User } from './entities/user.entity';
import { passwordToHash } from '../common/helpers/password.helper';
import { v4 as uuid } from 'uuid';
import { Role } from './enums/role.enums';
import { UsersService } from './services/users.service';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(connection: Connection, private service: UsersService) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { password } = event.entity;
    if (password) {
      event.entity.password = await passwordToHash(password);
    }
    event.entity.salt = await uuid();
    event.entity.roles = [Role.USER];
    // console.log(`BEFORE USER INSERTED: `, event.entity);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (!event.entity) return;
    const user = await this.service.findOneById(event.entity.id);
    const { password } = event.entity;
    if (password) {
      if (password != user.password) {
        event.entity.password = await passwordToHash(password);
      }
    }
  }
}
