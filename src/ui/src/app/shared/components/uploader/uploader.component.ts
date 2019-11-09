import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Shikimori} from "../../../types/shikimori";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit, OnChanges {

  @Input()
  public uploadedByUser: string | number;
  public uploader: Shikimori.User = null;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const uploader: string = changes.uploadedByUser.currentValue;
    const isUserId: boolean = /\d+/.test(uploader);

    if (uploader) {
      this.http.get(`https://shikimori.one/api/users/${ isUserId ? uploader : uploader + '?is_nickname=1' }`)
        .subscribe(
          user => {
            this.uploader = new Shikimori.User(user);
          }
        );
    }
  }

}
