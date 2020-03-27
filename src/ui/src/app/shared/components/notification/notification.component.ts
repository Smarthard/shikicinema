import {Component, Input, OnInit} from '@angular/core';
import {Notification, NotificationType} from '../../../types/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public TYPES = NotificationType;

  @Input()
  public notification: Notification;

  public alive: boolean = true;

  constructor() { }

  ngOnInit() { }

}
