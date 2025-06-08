import {
    HttpClient,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    map,
    switchMap,
    take,
} from 'rxjs/operators';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { Comment } from '@app/shared/types/shikimori/comment';
import { CommentableEnum } from '@app/shared//types/shikimori/commentable.enum';
import { CreateComment } from '@app/shared/types/shikimori/create-comment.interface';
import { Credentials } from '@app/shared/types/shikimori/credentials';
import { EpisodeNotification } from '@app/shared//types/shikimori/episode-notification.interface';
import { EpisodeNotificationResponse } from '@app/shared/types/shikimori/episode-notification-response.interface';
import { FindAnimeQuery } from '@app/shared/types/shikimori/queries/find-anime-query';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';
import { Topic } from '@app/shared/types/shikimori/topic';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserAnimeRatesQuery } from '@app/shared/types/shikimori/queries/user-anime-rates-query';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { UserBriefRateInterface } from '@app/shared/types/shikimori/user-brief-rate.interface';
import { UserInterface } from '@app/shared/types/shikimori/user.interface';
import { environment } from '@app-env/environment';
import { setPaginationToParams } from '@app/shared/types/shikimori/helpers/pagination-helper';
import { toShikimoriCredentials } from '@app/shared/types/shikimori/mappers/auth.mappers';


@Injectable({
    providedIn: 'root',
})
export class ShikimoriClient {
    readonly episodeNotificationToken = environment.shikimori.episodeNotificationToken;
    readonly shikimoriClientId = environment.shikimori.authClientId;
    readonly shikimoriClientSecret = environment.shikimori.authClientSecret;

    constructor(
        @Inject(SHIKIMORI_DOMAIN_TOKEN)
        private shikimoriDomain$: Observable<string>,
        private http: HttpClient,
    ) {}

    getNewToken(authCode: string): Observable<ShikimoriCredentials> {
        const params = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('client_id', environment.shikimori.authClientId)
            .set('client_secret', environment.shikimori.authClientSecret)
            .set('code', authCode)
            .set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.post<Credentials>(`${domain}/oauth/token`, null, { params })
                .pipe(map(toShikimoriCredentials)),
            ),
        );
    }

    refreshToken(refreshToken: string): Observable<ShikimoriCredentials> {
        const params = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('client_id', this.shikimoriClientId)
            .set('client_secret', this.shikimoriClientSecret)
            .set('refresh_token', refreshToken);

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.post<Credentials>(`${domain}/oauth/token`, null, { params })
                .pipe(map(toShikimoriCredentials)),
            ),
        );
    }

    getCurrentUser(): Observable<UserBriefInfoInterface> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<UserBriefInfoInterface>(`${domain}/api/users/whoami`)),
        );
    }

    /**
     * @description get full info about shikimori user
     * @see less info about user here - [getUserBriefInfo]{@link ShikimoriClient#getUserBriefInfo}
     *
     * @param {string} idOrUsername shikimori user's id or nickname
     * @return {Observable} shikimori user info by id or nickname
     */
    getUser(idOrUsername: ResourceIdType): Observable<UserInterface> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<UserInterface>(`${domain}/api/users/${idOrUsername}`)),
        );
    }

    /**
     * @description get short yet describable information about shikimori user:
     * <ul>
     *     <li>id</li>
     *     <li>avatar images</li>
     *     <li>last online</li>
     *     <li>username</li>
     *     <li>name</li>
     *     <li>sex</li>
     *     <li>website</li>
     *     <li>locale</li>
     * </ul>
     * @see more info about user here - [getUser]{@link ShikimoriClient#getUser}
     *
     * @param {string} idOrUsername shikimori user's id or nickname
     * @return {Observable} shikimori user shorter info by id or nickname
     */
    getUserBriefInfo(idOrUsername: ResourceIdType): Observable<UserBriefInfoInterface> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<UserBriefInfoInterface>(`${domain}/api/users/${idOrUsername}/info`)),
        );
    }

    getUserRates(userId?: ResourceIdType): Observable<UserBriefRateInterface[]> {
        let params = new HttpParams();

        if (userId) {
            params = params.set('user_id', userId);
        }

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<UserBriefRateInterface[]>(`${domain}/api/v2/user_rates`, { params })),
        );
    }

    getUserAnimeRates(userId: ResourceIdType, query?: UserAnimeRatesQuery): Observable<UserAnimeRate[]> {
        let params = setPaginationToParams(query);

        if (query?.censored) {
            params = params.set('censored', query.censored);
        }

        if (query?.status) {
            params = params.set('status', query.status);
        }

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap(
                (domain) => this.http.get<UserAnimeRate[]>(`${domain}/api/users/${userId}/anime_rates`, { params }),
            ),
        );
    }

    findAnimes(query?: FindAnimeQuery): Observable<AnimeBriefInfoInterface[]> {
        let params = setPaginationToParams(query);

        if (query?.search) {
            params = params.set('search', query.search);
        }

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<AnimeBriefInfoInterface[]>(`${domain}/api/animes`, { params })),
        );
    }

    getAnimeInfo(animeId: string): Observable<AnimeBriefInfoInterface> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<AnimeBriefInfoInterface>(`${domain}/api/animes/${animeId}`)),
        );
    }

    getUserRateById(id: ResourceIdType): Observable<UserAnimeRate> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<UserAnimeRate>(`${domain}/api/v2/user_rates/${id}`)),
        );
    }

    createUserRate(userRates: Partial<UserAnimeRate>): Observable<UserAnimeRate> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.post<UserAnimeRate>(`${domain}/api/v2/user_rates`, userRates)),
        );
    }

    updateUserRate(userRates: Partial<UserAnimeRate>): Observable<UserAnimeRate> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap(
                (domain) => this.http.patch<UserAnimeRate>(`${domain}/api/v2/user_rates/${userRates?.id}`, userRates),
            ),
        );
    }

    getTopics(animeId: ResourceIdType, episode?: ResourceIdType, revalidate = false): Observable<Topic[]> {
        let headers = new HttpHeaders();
        let params = new HttpParams()
            .set('kind', 'episode');

        if (episode) {
            params = params.set('episode', `${episode}`);
        }

        if (revalidate) {
            headers = headers
                .set('Cache-Control', 'no-cache, no-store, must-revalidate')
                .set('Pragma', 'no-cache');
        }

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap(
                (domain) => this.http.get<Topic[]>(`${domain}/api/animes/${animeId}/topics`, { params, headers }),
            ),
        );
    }

    createEpisodeTopic(animeId: ResourceIdType, episode: number): Observable<EpisodeNotificationResponse> {
        const body: EpisodeNotification = {
            episode_notification: {
                anime_id: animeId,
                episode,
                aired_at: new Date().toISOString(),
            },
            token: this.episodeNotificationToken,
        };

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap(
                (domain) => this.http.post<EpisodeNotificationResponse>(`${domain}/api/v2/episode_notifications`, body),
            ),
        );
    }

    getComments(commentableId: ResourceIdType, page = 1, limit = 30, desc: '0' | '1' = '0'): Observable<Comment[]> {
        let params = new HttpParams()
            .set('commentable_id', `${commentableId}`)
            .set('commentable_type', 'Topic')
            .set('page', `${page}`)
            .set('limit', `${limit}`);

        if (desc) {
            params = params.set('desc', desc);
        }

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<Comment[]>(`${domain}/api/comments`, { params })),
        );
    }

    createComment(commentableId: ResourceIdType, comment: string): Observable<Comment> {
        const body: CreateComment = {
            comment: {
                body: comment,
                commentable_id: commentableId,
                commentable_type: CommentableEnum.TOPIC,
                // TODO: учитывать offtopic
                is_offtopic: false,
            },
            broadcast: false,
            frontend: false,
        };

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.post<Comment>(`${domain}/api/comments`, body)),
        );
    }

    deleteComment(commentId: ResourceIdType): Observable<void> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.delete<void>(`${domain}/api/comments/${commentId}`)),
        );
    }
}
