import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Shikivideo} from '../../../types/shikivideo';
import {HttpParams} from '@angular/common/http';
import {ShikivideosService} from '../../../services/shikivideos-api/shikivideos.service';
import {ShikivideosUnique} from '../../../types/shikivideos-unique';
import {NgForm} from '@angular/forms';
import {ShikimoriService} from '../../../services/shikimori-api/shikimori.service';

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
  public check: EventEmitter<Shikivideo> = new EventEmitter<Shikivideo>();

  public video: Shikivideo;
  public sources: string[];

  constructor(
    private videoApi: ShikivideosService,
    private shikimori: ShikimoriService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.shikimori.getAnime(this.animeId)
      .subscribe(
        (anime: any) => {
          console.log('anime', anime);
          this.video = new Shikivideo({
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

  search4Authors() {
    let params = new HttpParams()
      .set('column', 'author')
      .set('filter', `${this.video.author}`);


    if (this.video.author.length > 2) {
      this.videoApi.getUniqueValues(params)
        .subscribe(
          (sources: ShikivideosUnique[]) => {
            const authorsSet = new Set<string>();

            Object.keys(sources).forEach((ep: string) => {
              sources[ep].author.forEach(author => authorsSet.add(author));
            });

            this.sources = [...authorsSet];
          }
        );
    }
  }

  onSubmit(videoForm: NgForm) {
    const video = new Shikivideo(videoForm.value);
    const params = new HttpParams()
      .set('anime_id', video.anime_id)
      .set('anime_english', JSON.stringify(video.anime_english))
      .set('anime_russian', JSON.stringify(video.anime_russian))
      .set('author', JSON.stringify(video.author))
      .set('episode', `${video.episode}`)
      .set('kind', video.kind)
      .set('language', video.language)
      .set('uploader', JSON.stringify(video.uploader))
      .set('url', JSON.stringify(video.url))
      .set('quality', video.quality);

    this.videoApi.uploadVideo(params).toPromise();
  }

}
