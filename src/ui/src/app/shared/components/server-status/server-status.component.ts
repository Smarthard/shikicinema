import {Component, OnInit} from '@angular/core';
import {ServerStatus} from "../../../types/ServerStatus";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-server-status',
  templateUrl: './server-status.component.html',
  styleUrls: ['./server-status.component.css']
})
export class ServerStatusComponent implements OnInit {

  public status: ServerStatus = new ServerStatus();
  public uptime: ServerStatus = new ServerStatus();

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.refresh();
  }

  public refresh() {
    this.http.get('https://smarthard.net/api/status')
      .subscribe(
        status => this.status = new ServerStatus(status)
      );

    this.http.get('https://smarthard.net/api/status/uptime')
      .subscribe(
        uptime => this.uptime = new ServerStatus(uptime)
      )
  }

  public getStatusString(): string {
    let status: string = `Статус сервера: ${this.status.api}\n`;

    status += this.status.isApiOnline()
      ? `uptime: ${this.uptime.api}`
      : `сервер скоро будет доступен`;

    return status;
  }

}