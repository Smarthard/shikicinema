import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {ShikivideosService} from '../../../services/shikivideos-api/shikivideos.service';
import {SmarthardNet} from '../../../types/smarthard-net';
import {NgForm} from '@angular/forms';
import {ShikimoriService} from '../../../services/shikimori-api/shikimori.service';
import {NotificationsService} from '../../../services/notifications/notifications.service';
import {Notification, NotificationType} from '../../../types/notification';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/auth/auth.service';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent implements OnDestroy, OnChanges {

  @Input()
  public animeId: number;

  @Input()
  public uploaderId: number;

  @Input()
  public episode: number;

  @Output()
  public check = new EventEmitter<SmarthardNet.Shikivideo>();

  @Output()
  public uploaded = new EventEmitter<SmarthardNet.Shikivideo>();

  @Output()
  public close = new EventEmitter();

  @ViewChild('authorInput', { static: true })
  _inputAuthorRef: ElementRef;

  autoIncEpisode = true;
  isAlive = true;
  videoWasChecked = false;
  matcher = new ErrorStateMatcher();

  public video = new SmarthardNet.Shikivideo();

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
    private auth: AuthService,
    private notify: NotificationsService,
    private videoApi: ShikivideosService,
    private shikimori: ShikimoriService
  ) {}

  ngOnDestroy(): void {
    this.isAlive = false;
  }

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
    const embedUrlRegex = /(https?:)?\/\/(www\.)?[-a-z0-9@:%._~#=]{1,256}\.[a-z0-9()]{1,6}\b([-a-z0-9()@:%_.~#?&/=]*)/i;
    const clipboardData = evt.clipboardData.getData('text');
    let link = clipboardData.match(embedUrlRegex)[0];

    evt.preventDefault();

    if (link.startsWith('//')) {
      link = link.replace(/^\/\//, 'https://');
    }

    return embedUrlRegex.test(clipboardData) ? link : clipboardData;
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
      .set('author', video.author ? video.author : '')
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
            this.uploaded.emit(video);

            if (this.autoIncEpisode) {
              this.video.episode++;
            }
          }
        },
        err => {
            this.notify.add(new Notification(
              NotificationType.WARNING, `Произошла ошибка, подробнее в консоли (F12)`, err.error)
            );
        }
      );
  }

  getUniqueAuthors(unique: SmarthardNet.Unique) {
    const AUTHORS: string[] = [];

    Object.keys(unique)
      .forEach((key) => AUTHORS.push(...unique[key].author));

    return [...new Set(AUTHORS)];
  }

  checkVideo(video: SmarthardNet.Shikivideo) {
    this.videoWasChecked = true;
    this.check.emit(video);
  }

}
