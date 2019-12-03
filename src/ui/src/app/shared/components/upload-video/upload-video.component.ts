import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ShikivideosService} from '../../../services/shikivideos-api/shikivideos.service';
import {SmarthardNet} from '../../../types/smarthard-net';
import {NgForm} from '@angular/forms';
import {ShikimoriService} from '../../../services/shikimori-api/shikimori.service';
import {NotificationsService} from '../../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../../types/notification';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent implements OnInit, OnChanges {

  @Input()
  public animeId: number;

  @Input()
  public uploaderId: number;

  @Input()
  public episode: number;

  @Output()
  public check: EventEmitter<SmarthardNet.Shikivideo> = new EventEmitter<SmarthardNet.Shikivideo>();

  public video: SmarthardNet.Shikivideo;

  private authorSubject = new Subject<Event>();

  readonly sources$ = this.authorSubject.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((author) => this.videoApi.getUniqueValues(
      new HttpParams()
        .set('column', 'author')
        .set('filter', `${author}`)
    ))
  );

  constructor(
    private notify: NotificationsService,
    private videoApi: ShikivideosService,
    private shikimori: ShikimoriService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.shikimori.getAnime(this.animeId)
      .subscribe(
        (anime: any) => {
          this.video = new SmarthardNet.Shikivideo({
            anime_id: this.animeId,
            uploader: this.uploaderId,
            episode: this.episode || 1,
            anime_english: anime.name,
            anime_russian: anime.russian,
            kind: 'озвучка',
            quality: 'TV',
            language: 'russian'
          })
        }
      );
  }

  trimUrl(evt: ClipboardEvent): string {
    const embedUrlRegex = /https?:\/\/(www\.)?[-a-z0-9@:%._~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_.~#?&/=]*)/i;
    const clipboardData = evt.clipboardData.getData('text');

    evt.preventDefault();
    return clipboardData.match(embedUrlRegex)[0] || clipboardData;
  }

  search4Authors($event: any) {
    this.authorSubject.next($event.target.value);
  }

  onSubmit(videoForm: NgForm) {
    const video = new SmarthardNet.Shikivideo(videoForm.value);
    const params = new HttpParams()
      .set('anime_id', video.anime_id)
      .set('anime_english', video.anime_english)
      .set('anime_russian', video.anime_russian)
      .set('author', video.author)
      .set('episode', `${video.episode}`)
      .set('kind', video.kind)
      .set('language', video.language)
      .set('uploader', video.uploader)
      .set('url', video.url)
      .set('quality', video.quality);

    this.videoApi.uploadVideo(params)
      .subscribe(
        res => {
          if (res.status === 201) {
            this.notify.add(new Notification(NotificationType.OK, 'Видео успешно загружено!'));
          }
        },
        err => {
            this.notify.add(new Notification(
              NotificationType.WARNING, `Произошла ошибка, подробнее в консоли (F12)`, err.error)
            );
        }
      );
  }

}
