import {Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../services/notifications/notifications.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css']
})
export class NotifyComponent implements OnInit {

  constructor(
    public notify: NotificationsService
  ) { }

  ngOnInit() {}

}
