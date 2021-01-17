import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Shikimori} from '../../types/shikimori';
import {Observable, of, throwError} from 'rxjs';
import {catchError, exhaustMap, map, timeout} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import IShikimoriFranchiseResponse = Shikimori.IFranchiseResponse;

@Injectable({
  providedIn: 'root'
})
export class ShikimoriService {

  private SHIKIMORI_URL = 'https://shikimori.one';

  constructor(
    private http: HttpClient
  ) {}

  public createUserRates(userRate: Shikimori.UserRate): Observable<Shikimori.UserRate> {
    return this.http.post<Shikimori.UserRate>(`${this.SHIKIMORI_URL}/api/v2/user_rates`, userRate, { withCredentials: true });
  }

  public getUserRates(params: HttpParams): Observable<Shikimori.UserRate[]> {
    return this.http.get<Shikimori.UserRate[]>(`${this.SHIKIMORI_URL}/api/v2/user_rates`, { params, withCredentials: true })
      .pipe(
        catchError(() => of([]))
      );
  }

  public setUserRates(userRate: Shikimori.UserRate): Observable<Shikimori.UserRate> {
    const id = userRate.id;

    return this.http.put<Shikimori.UserRate>(`${this.SHIKIMORI_URL}/api/v2/user_rates/${id}`, userRate, { withCredentials: true })
      .pipe(
        catchError(err => { console.warn(err); return of({}) })
      );
  }

  public incUserRates(userRate: Shikimori.UserRate): Observable<Shikimori.UserRate> {
    return this.http.post(`${this.SHIKIMORI_URL}/api/v2/user_rates/${userRate.id}/increment`, {}, { withCredentials: true });
  }

  public whoAmI(headers: HttpHeaders): Observable<Shikimori.User> {
    return this.http.get<Shikimori.User>(`${this.SHIKIMORI_URL}/api/users/whoami`, { headers, withCredentials: true });
  }

  public getUserInfo(user: string | number, params?: HttpParams): Observable<Shikimori.User> {
    const isNickname = !/^\d+$/.test(`${user}`);

    if (params && isNickname) {
      params.set('is_nickname', '1');
    } else if (isNickname) {
      params = new HttpParams().set('is_nickname', '1');
    }

    return this.http.get<Shikimori.User>(`${this.SHIKIMORI_URL}/api/users/${user}`, { params })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const deletedOrRenamedUser = new Shikimori.User({ avatar: 'https://shikimori.one/favicon.ico', nickname: user});

          return err.status === 404 ? of(deletedOrRenamedUser) : throwError(err)
        })
      );
  }

  public getAnime(animeId: number): Observable<Shikimori.Anime> {
    return this.http.get<Shikimori.Anime>(`${this.SHIKIMORI_URL}/api/animes/${animeId}`);
  }

  public getAnimeTopics(animeId: number, kind?: string, episode?: number, revalidate = false): Observable<Shikimori.ITopic[]> {
    let params = new HttpParams();
    let headers = new HttpHeaders();

    if (kind) {
      params = params.set('kind', kind);
    }

    if (episode) {
      params = params.set('episode', `${episode}`);
    }

    if (revalidate) {
      headers = headers
        .set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma', 'no-cache')
    }

    return this.http.get<Shikimori.ITopic[]>(`${this.SHIKIMORI_URL}/api/animes/${animeId}/topics`, { params, headers });
  }

  private _createComment(comment: Shikimori.IComment): Observable<Shikimori.Comment> {
    return this.http.post<Shikimori.IComment>(`${this.SHIKIMORI_URL}/api/comments`, { comment })
      .pipe(
        map((c) => new Shikimori.Comment(
          c.id,
          c.commentable_id,
          c.commentable_type,
          c.body,
          c.html_body,
          new Date(Date.parse(c.created_at)),
          new Date(Date.parse(c.updated_at)),
          c.is_offtopic,
          c.is_summary,
          c.can_be_edited,
          new Shikimori.User(c.user)
        ))
      );
  }

  public createEpisodeTopic(notification: Shikimori.IEpisodeNotification) {
    return this.http.post<Shikimori.IEpisodeNotificationResponse>(`${this.SHIKIMORI_URL}/api/v2/episode_notifications`, notification);
  }

  public createComment(animeId: number, episode: number, comment: Shikimori.Comment): Observable<Shikimori.Comment> {
    const EPISODE_NOTIFICATION_BODY: Shikimori.IEpisodeNotification = {
      episode_notification: {
        aired_at: new Date(),
        anime_id: animeId,
        is_anime365: '0',
        is_fandub: '0',
        is_raw: '1',
        is_subtitles: '0',
        episode
      },
      token: environment.EPISODE_NOTIFICATION_TOKEN
    }

    if (comment.commentableId) {
      return this._createComment({
        body: comment.body,
        commentable_id: comment.commentableId,
        commentable_type: comment.commentableType,
        is_offtopic: comment.isOfftopic,
        is_summary: comment.isSummary
      });
    } else {
      return this.getAnimeTopics(animeId, 'episode', episode, true)
        .pipe(
          exhaustMap((topics) => {
            if (topics && topics[0] && !!topics[0].id) {
              // if topic created before comment creation
              return this._createComment({
                body: comment.body,
                commentable_id: topics[0].id,
                commentable_type: comment.commentableType,
                is_offtopic: comment.isOfftopic,
                is_summary: comment.isSummary
              });
            } else {
              // else create topic and post comment
              return this.createEpisodeTopic(EPISODE_NOTIFICATION_BODY)
                .pipe(
                  exhaustMap((topic) => this._createComment({
                    body: comment.body,
                    commentable_id: topic.topic_id,
                    commentable_type: comment.commentableType,
                    is_offtopic: comment.isOfftopic,
                    is_summary: comment.isSummary
                  }))
                );
            }
          })
        );
    }
  }

  public deleteComment(id: number) {
    return this.http.delete(`${this.SHIKIMORI_URL}/api/comments/${id}`, { observe: 'response' })
      .pipe(
        timeout(3000),
        map((res: HttpResponse<any>) => res.ok)
      );
  }

  public getComment(id: number) {
    return this.http.get<Shikimori.IComment>(`${this.SHIKIMORI_URL}/api/comments/${id}`)
      .pipe(
        catchError(async (err) => ({
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          html_body: 'Сообщение удалено',
          body: 'Сообщение удалено',
          can_be_edited: false,
        } as Shikimori.IComment)),
        map((c) => new Shikimori.Comment(
          c.id,
          c.commentable_id,
          c.commentable_type,
          c.body,
          c.html_body,
          new Date(Date.parse(c.created_at)),
          new Date(Date.parse(c.updated_at)),
          c.is_offtopic,
          c.is_summary,
          c.can_be_edited,
          new Shikimori.User(c.user)
        ))
      );
  }

  public getComments(
    commentableId: number, type: Shikimori.CommentableType, page: number = 1, limit: number = 20, desc?: '0' | '1', isSumary?: boolean
  ) {
    let params = new HttpParams()
      .set('commentable_id', `${commentableId}`)
      .set('commentable_type', `${type}`)
      .set('page', `${page}`)
      .set('limit', `${limit}`);

    if (desc) {
      params = params.set('desc', desc)
    }

    if (isSumary) {
      params = params.set('is_summary', `${isSumary}`);
    }

    return this.http.get<Shikimori.IComment[]>(`${this.SHIKIMORI_URL}/api/comments`, { params })
      .pipe(
        map((comments) => comments
          .map(c => new Shikimori.Comment(
            c.id,
            c.commentable_id,
            c.commentable_type,
            c.body,
            c.html_body,
            new Date(Date.parse(c.created_at)),
            new Date(Date.parse(c.updated_at)),
            c.is_offtopic,
            c.is_summary,
            c.can_be_edited,
            new Shikimori.User(c.user)
          ))
        )
      );
  }

  public async getNewToken(): Promise<Shikimori.Token> {
    return new Promise(async (resolve, reject) => {
      const code = await this._getShikimoriAuthCode() || null;
      const params = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('client_id', environment.SHIKIMORI_CLIENT_ID)
        .set('client_secret', environment.SHIKIMORI_CLIENT_SECRET)
        .set('code', code)
        .set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

      if (code) {
        this.http.post<Shikimori.IToken>('https://shikimori.one/oauth/token', null, { params })
          .subscribe(
            async (token) => {
              const shikimoriToken = new Shikimori.Token(token.access_token, token.refresh_token, token.created_at, token.expires_in);
              resolve(shikimoriToken);
            }
          );
      } else {
        reject();
      }
    });
  }

  public getRefreshedToken(oldToken: Shikimori.Token): Promise<Shikimori.Token> {
    const params = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', environment.SHIKIMORI_CLIENT_ID)
      .set('client_secret', environment.SHIKIMORI_CLIENT_SECRET)
      .set('refresh_token', oldToken.resfresh);

    return this.http.post<Shikimori.IToken>('https://shikimori.one/oauth/token', null,{ params })
      .pipe(
        map((token) => new Shikimori.Token(token.access_token, token.refresh_token, token.created_at, token.expires_in))
      ).toPromise();
  }

  public getFranchise(anime: Shikimori.Anime): Observable<IShikimoriFranchiseResponse> {
    return this.http.get<IShikimoriFranchiseResponse>(`https://shikimori.one/api/animes/${anime.id}/franchise`);
  }

  private _getShikimoriAuthCode(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let codeUrl = new URL('https://shikimori.one/oauth/authorize?');
      codeUrl.searchParams.set('client_id', environment.SHIKIMORI_CLIENT_ID);
      codeUrl.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');
      codeUrl.searchParams.set('response_type', 'code');

      chrome.tabs.query({active: true}, ([selectedTab]) =>
        chrome.tabs.create({active: true, url: codeUrl.toString()}, new_tab => {

          const onRemove = (tabId) => {
            if (tabId === new_tab.id) {
              reject({error: 'tab-removed'});
              removeListeners();
            }
          };

          const onUpdate = (tabId, changeInfo) => {
            if (!changeInfo.url)
              return;

            const tabUrl = new URL(changeInfo.url);
            const error = tabUrl.searchParams.get('error');
            const message = tabUrl.searchParams.get('error_description');
            const code = tabUrl.toString().split('authorize/')[1];

            if (tabId !== new_tab.id || !changeInfo.url || tabUrl.toString().includes('response_type'))
              return;

            if (error || message) {
              reject({ error, message });
            } else {
              resolve(code);
            }

            removeListeners();
            chrome.tabs.update(
              selectedTab.id,
              { active: true },
              () => chrome.tabs.remove(new_tab.id)
            );
          };

          const removeListeners = () => {
            chrome.tabs.onRemoved.removeListener(onRemove);
            chrome.tabs.onUpdated.removeListener(onUpdate);
          };

          chrome.tabs.onRemoved.addListener(onRemove);
          chrome.tabs.onUpdated.addListener(onUpdate);
        })
      );
    });
  }
}
