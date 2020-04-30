import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, iif, Observable, of, ReplaySubject} from 'rxjs';
import {Shikimori} from '../../types/shikimori';
import {ShikimoriService} from '../shikimori-api/shikimori.service';
import {distinctUntilChanged, map, mergeMap, scan, shareReplay, switchMap} from 'rxjs/operators';

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

  readonly episode$ = this._episodeSubject
    .pipe(
      distinctUntilChanged()
    );

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
      mergeMap(([topic, page, limit, order]) => iif(() => !!topic,
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
      ? url.replace(CommentsService.PLAYER_URL, 'https://shikimori.one/')
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
      .querySelectorAll('.b-quote')
      .forEach((elem) => elem.classList.replace('b-quote', 'shc-quote'));

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
      .forEach((link: HTMLLinkElement) => link.href = this.cleanUrl(link.href))
    PARSED_COMMENTS
      .querySelectorAll('*[src]')
      .forEach((resource: HTMLSourceElement) => resource.src = this.cleanUrl(resource.src))

    comment.html = PARSED_COMMENTS.documentElement.innerHTML;
    return comment;
  }
}
