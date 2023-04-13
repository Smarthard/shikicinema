import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, iif, Observable, of, ReplaySubject, throwError} from 'rxjs';
import {Shikimori} from '../../types/shikimori';
import {ShikimoriService} from '../shikimori-api/shikimori.service';
import {distinctUntilChanged, map, mergeMap, scan, shareReplay, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private static readonly PLAYER_URL = chrome.runtime.getURL('/');

  private totalComments = 0;
  private limit = 20;
  private page = 1;

  private _animeSubject = new ReplaySubject<Shikimori.Anime>();
  private _episodeSubject = new ReplaySubject<number>(1);
  private _limitSubject = new BehaviorSubject<number>(20);
  private _orderSubject = new BehaviorSubject<'0' | '1'>('1');
  private _pageSubject = new BehaviorSubject<number>(1);
  private _domParser = new DOMParser();

  readonly anime$ = this._animeSubject
    .pipe(
      distinctUntilChanged((a, b) => a.id === b.id)
    );

  readonly episode$ = this._episodeSubject.asObservable();

  readonly limit$ = this._limitSubject
    .pipe(
      distinctUntilChanged()
    );

  readonly order$ = this._orderSubject
    .pipe(
      distinctUntilChanged()
    );

  readonly page$ = this._pageSubject
    .pipe(
      distinctUntilChanged()
    );

  readonly topic$ = this.episode$
    .pipe(
      (episode$) => combineLatest([this.anime$, episode$]),
      switchMap(([anime, episode]) => this.shikimori.getAnimeTopics(anime.id, 'episode', episode)),
      map((topics: Shikimori.ITopic[]) => topics.length > 0 ? topics[0] : {} as Shikimori.ITopic),
      shareReplay(1)
    );

  readonly _comments$ = this.topic$
    .pipe(
      (topic$) => combineLatest([topic$, this.page$, this.limit$, this.order$]),
      mergeMap(([topic, page, limit, order]) => iif(() => !!topic && !!topic.id,
        this.shikimori.getComments(topic.id, 'Topic', page, limit, order),
        of([])
      )),
      map((comments: Shikimori.Comment[]) => comments.map((c) => this.parseHtml(c))),
      shareReplay(1)
    );

  readonly comments$: Observable<Shikimori.Comment[]> = this._comments$
    .pipe(
      scan((acc, value) => this.mergeComments(acc, value))
    );

  readonly users$ = this.comments$
    .pipe(
      map((comments) => comments.map((c) => c.user.nickname)),
      map((nicknames: string[]) => [...new Set(nicknames)])
    );

  constructor(
    private shikimori: ShikimoriService
  ) {
    this.page$.subscribe((page) => this.page = page);
    this.topic$.subscribe((topic) => {
      this.totalComments = topic?.comments_count || 0;
      this._pageSubject.next(1);
    });
    this.limit$.subscribe((limit) => this.limit = limit);
  }

  public createComment(anime: Shikimori.Anime, episode: number, comment: Shikimori.Comment): Observable<Shikimori.Comment> {
    const ANIME_RELEASED = anime.status === 'released';
    const COMMENTING_ONGONING_AIRED_EPISODE = anime.status === 'ongoing' && anime.episodes_aired >= episode;

    if (ANIME_RELEASED || COMMENTING_ONGONING_AIRED_EPISODE) {
      return this.shikimori.createComment(anime.id, episode, comment)
        .pipe(
          tap(() => this._episodeSubject.next(episode))
        );
    } else {
      return throwError(new Error('Нельзя комментировать еще невышедшие серии!'))
    }
  }

  public deleteComment(id: number) {
    return this.shikimori.deleteComment(id);
  }

  parseBBComment(bbComment: string): string {
    let parsed = bbComment;
    const SEARCH = [
      /\n/g,

      / (:-?[DP(]) /g,
      / :-o /g,
      / :\) /g,
      / \+_\+ /g,
      / :(.*?): /g,

      /\[b](.*?)\[\/b]/ig,
      /\[i](.*?)\[\/i]/ig,
      /\[u](.*?)\[\/u]/ig,
      /\[s](.*?)\[\/s]/ig,

      /\[spoiler_v1='?(.*?)'?](.*)\[\/spoiler_v1]/ig,

      /\|\|(.*?)\|\|/ig,

      /\[spoiler](.*)\[\/spoiler]/ig,

      /\[spoiler='?(.*?)'?](.*)\[\/spoiler]/ig,

      /\[url='?(.*?)'?](.*?)\[\/url]/ig,

      /\[img](.*?)\[\/img]/ig,

      /\[comment='?(.*?)'?](.*?)\[\/comment]/ig,

      /\[quote=c(.*?);(.*?);(.*?)](.*?)\[\/quote]/ig,

      /\[quote=(.*?)](.*?)\[\/quote]/ig
    ];
    const REPLACE = [
      '<br>',

      '<img class="smiley" title="$1" alt="$1" src="https://shikimori.me/images/smileys/$1.gif">',
      '<img class="smiley" title=":-o" alt=":-o" src="https://shikimori.me/images/smileys/:-o.gif">',
      '<img class="smiley" title=":)" alt=":)" src="https://shikimori.me/images/smileys/:).gif">',
      '<img class="smiley" title="+_+" alt="+_+" src="https://shikimori.me/images/smileys/+_+.gif">',
      '<img class="smiley" title=":$1:" alt=":$1:" src="https://shikimori.me/images/smileys/:$1:.gif">',

      '<b>$1</b>',
      '<i>$1</i>',
      '<u>$1</u>',
      '<s>$1</s>',

      `<div class="shc-spoiler" onclick="">
        <label>$1</label>
        <div class="content">
            <div class="before"></div>
            <div class="inner text">$2</div>
            <div class="after"></div>
        </div>
      </div>`,

      `<button class="shc-inline-spoiler" onclick=""><span>$1</span></button>`,

      `<button class="shc-inline-spoiler" onclick=""><span>$1</span></button>`,

      `<div class="shc-block-spoiler" onclick="">
        <button>$1</button>
        <div>$2</div>
      </div>`,

      '<a class="shc-links" href="$1">$2</a>',

      `<a class="shc-image">
        <img src="$1" alt="$1">
      </a>`,

      '<a class="shc-links bubbled" href="https://shikimori.me/comments/$1">@$2</a>',

      `<div class="shc-quote">
        <div class="quoteable">
            <a class="shc-links bubbled b-user16" href="https://shikimori.me/comments/$1">
                <img src="https://shikimori.me/system/users/x16/$2.png" alt="$3">
                <span>$3</span>
            </a>
        </div>$4
      </div>`,

      `<div class="shc-quote">
        <div class="quoteable">
            <a class="shc-links bubbled b-user16">
                <span>$1</span>
            </a> написал:
        </div>$2
      </div>`
    ];

    for (let i = 0; i < SEARCH.length; i++) {
      while (SEARCH[i].test(parsed)) {
        parsed = parsed.replace(SEARCH[i], REPLACE[i]);
      }
    }

    return parsed;
  }

  public setAnime(anime: Shikimori.Anime) {
    this._animeSubject.next(anime);
  }

  public setEpisode(episode: number) {
    this._episodeSubject.next(episode);
  }

  public setLimit(limit: number) {
    this._limitSubject.next(limit > 0 && limit <= 30 ? limit : 20);
  }

  public setOrder(order: '0' | '1') {
    this._orderSubject.next(order);
  }

  public setPage(page: number) {
    this._pageSubject.next(page);
  }

  public nextPage() {
    if (this.hasNextPage) {
      this._pageSubject.next(++this.page);
    }
  }

  public get pagesRemaining(): number {
    return (this.totalComments / this.pageSize) - this.page;
  }

  public get commentsRemaining(): number {
    const commentsShowed = this.pageSize * this.page;
    return this.totalComments - commentsShowed;
  }

  public get hasNextPage(): boolean {
    return this.pagesRemaining > 0;
  }

  public get pageSize(): number {
    return this.limit;
  }

  public getCommentById(id: number): Observable<Shikimori.Comment> {
    return this.shikimori.getComment(id)
      .pipe(
        map((c) => this.parseHtml(c))
      );
  }

  cleanUrl(url: string) {
    return url.startsWith(CommentsService.PLAYER_URL)
      ? url.replace(CommentsService.PLAYER_URL, 'https://shikimori.me/')
      : url;
  }

  mergeComments(acc: Shikimori.Comment[], newValues: Shikimori.Comment[]): Shikimori.Comment[] {
    const accFirst = acc[0];
    const newFirst = newValues[0];

    if (accFirst && newValues && newFirst && accFirst.commentableId === newFirst.commentableId) {
      const intersection = acc.filter(a => newValues.some(n => a.id === n.id));
      acc = acc.filter(a => !intersection.some(i => a.id === i.id));
      return [...newValues, ...acc];
    } else {
      return newValues;
    }
  }

  parseHtml(comment: Shikimori.Comment): Shikimori.Comment {
    const PARSED_COMMENTS = this._domParser.parseFromString(comment.html, 'text/html');

    PARSED_COMMENTS
      .querySelectorAll('.b-link')
      .forEach((elem) => elem.classList.replace('b-link', 'shc-links'));
    PARSED_COMMENTS
      .querySelectorAll('.b-image')
      .forEach((elem) => elem.classList.replace('b-image', 'shc-image'));
    PARSED_COMMENTS
      .querySelectorAll('.b-replies')
      .forEach((elem) => elem.classList.replace('b-replies', 'shc-replies'));
    PARSED_COMMENTS
      .querySelectorAll('.b-spoiler')
      .forEach((elem) => elem.classList.replace('b-spoiler', 'shc-spoiler'));
    PARSED_COMMENTS
      .querySelectorAll('.b-spoiler_inline')
      .forEach((elem) => elem.classList.replace('b-spoiler_inline', 'shc-inline-spoiler'));
    PARSED_COMMENTS
      .querySelectorAll('.b-spoiler_block')
      .forEach((elem) => elem.classList.replace('b-spoiler_block', 'shc-block-spoiler'));
    PARSED_COMMENTS
      .querySelectorAll('.b-quote')
      .forEach((elem) => elem.classList.replace('b-quote', 'shc-quote'));
    PARSED_COMMENTS
      .querySelectorAll('.quoteable a')
      .forEach((a: HTMLLinkElement) => a.classList.add('shc-links', 'bubbled'));

    PARSED_COMMENTS
      .querySelectorAll('.inner')
      .forEach((elem) => elem.classList.add('text'));
    PARSED_COMMENTS
      .querySelectorAll('.b-mention')
      .forEach((elem) => elem.classList.add('shc-links'));
    PARSED_COMMENTS
      .querySelectorAll('.shc-spoiler')
      .forEach((elem) => elem.classList.add('inline'));

    PARSED_COMMENTS
      .querySelectorAll('a[href]')
      .forEach((link: HTMLLinkElement) => link.href = this.cleanUrl(link.href));
    PARSED_COMMENTS
      .querySelectorAll('*[src]')
      .forEach((resource: HTMLSourceElement) => resource.src = this.cleanUrl(resource.src));

    comment.html = PARSED_COMMENTS.documentElement.innerHTML;
    return comment;
  }
}
