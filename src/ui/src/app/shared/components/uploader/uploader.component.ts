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
  public uploadedByUser: string | number | Shikimori.User;
  public uploader: Shikimori.User = null;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    const uploader: string | number | Shikimori.User = changes.uploadedByUser.currentValue;

    if (uploader) {
      if (uploader instanceof Shikimori.User) {
        this.uploader = uploader;
      } else {
        const isUserId: boolean = /\d+/.test(`${uploader}`);
        this.http.get(`https://shikimori.one/api/users/${ isUserId ? uploader : uploader + '?is_nickname=1' }`)
          .subscribe(
            user => {
              this.uploader = new Shikimori.User(user);
            }
          );
      }
    }
  }

}
