import {Injectable} from '@angular/core';
import {Notification} from '../../types/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private queue: Array<Notification> = [];

  constructor() {}

  public add(notification: Notification) {
    this.queue.push(notification);
  }

  get all(): Notification[] {
    return this.queue;
  }

  get next(): Notification | null {
    return this.queue.shift() || null;
  }

}
