import {Component, Input, OnInit} from '@angular/core';
import {Notification, NotificationType} from '../../../types/notification';

@Component({
  selector: 'app-nitification',
  templateUrl: './nitification.component.html',
  styleUrls: ['./nitification.component.css']
})
export class NitificationComponent implements OnInit {

  public TYPES = NotificationType;

  @Input()
  public timeout: number = 5000;

  @Input()
  public notification: Notification;

  public alive: boolean = true;

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.alive = false, this.timeout);
  }

}
