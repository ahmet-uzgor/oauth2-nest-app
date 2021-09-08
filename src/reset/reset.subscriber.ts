import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Reset } from './reset.entity';

@EventSubscriber()
export class ResetsSubscriber implements EntitySubscriberInterface<Reset> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Reset;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async beforeInsert(event: InsertEvent<Reset>) {}
}
