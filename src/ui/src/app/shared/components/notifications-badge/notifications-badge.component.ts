import {Component, Input, OnInit} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';
import {RemoteNotificationsService} from '../../../services/remote-notifications/remote-notifications.service';

@Component({
  selector: 'app-notifications-badge',
  templateUrl: './notifications-badge.component.html',
  styleUrls: ['./notifications-badge.component.css']
})
export class NotificationsBadgeComponent implements OnInit {

  @Input()
  public notifications: SmarthardNet.Notification[];

  constructor(
    private remoteNotifications: RemoteNotificationsService
  ) {}

  ngOnInit(): void {}

  hasUnread(notifications: SmarthardNet.Notification[]): boolean {
    return notifications && notifications.length > 0 ? notifications.some(notification => !notification.viewed) : false;
  }

  unread(notifications: SmarthardNet.Notification[]): number {
    return notifications && notifications.length > 0 ? notifications.filter(notification => !notification.viewed).length : 0;
  }

  markUnread(notifications: SmarthardNet.Notification[]) {
    this.remoteNotifications.setReadNotifications(notifications);
  }

}
