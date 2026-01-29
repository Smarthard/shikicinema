import {
    HttpClient,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    filter,
    map,
    switchMap,
    take,
} from 'rxjs/operators';

import {
    AnimeBriefInfoInterface,
    Comment,
    CommentableEnum,
    CreateComment,
    Credentials,
    EpisodeNotification,
    EpisodeNotificationResponse,
    Topic,
    UserAnimeRate,
    UserBriefInfoInterface,
    UserBriefRateInterface,
    UserInterface,
    UserRateTargetEnum,
} from '@app/shared/types/shikimori';
import { AnimeRatesMetadataGQLResponse, UserAnimeRatesGQLResponse } from '@app/shared/types/shikimori/graphql';
import { FindAnimeQuery, UserAnimeRatesQuery } from '@app/shared/types/shikimori/queries';
import { ResourceIdType } from '@app/shared/types';
import { ShikimoriCredentials } from '@app/store/auth/types/auth-store.interface';
import { environment } from '@app-env/environment';
import {
    mapAnimeRatesMetadataGQL,
    mapAnimeRatesMetadataGQLQuery,
    mapUserAnimeRatesGQL,
    mapUserRatesGQLQuery,
    toShikimoriCredentials,
} from '@app/shared/types/shikimori/mappers';
import { selectShikimoriDomain } from '@app/store/shikimori/selectors';
import { setPaginationToParams } from '@app/shared/types/shikimori/helpers';


@Injectable({
    providedIn: 'root',
})
export class ShikimoriClient {
    readonly episodeNotificationToken = environment.shikimori.episodeNotificationToken;
    readonly shikimoriClientId = environment.shikimori.authClientId;
    readonly shikimoriClientSecret = environment.shikimori.authClientSecret;

    private readonly http = inject(HttpClient);
    private readonly store = inject(Store);
    private readonly shikimoriDomain$ = this.store.select(selectShikimoriDomain).pipe(filter(Boolean));

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

    getUserRates(userId: ResourceIdType, targetType: UserRateTargetEnum): Observable<UserBriefRateInterface[]> {
        const params = new HttpParams()
            .set('user_id', userId)
            .set('target_type', targetType);

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

    getUserAnimeRatesMetadataGQL(animeIds: ResourceIdType[]) {
        const query = mapAnimeRatesMetadataGQLQuery(animeIds);

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap(
                (domain) => this.http.post<AnimeRatesMetadataGQLResponse>(`${domain}/api/graphql`, { query })
                    .pipe(map(mapAnimeRatesMetadataGQL)),
            ),
        );
    }

    getUserAnimeRatesGQL(animeRatesQuery: UserAnimeRatesQuery): Observable<UserAnimeRate[]> {
        const query = mapUserRatesGQLQuery(animeRatesQuery);

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap(
                (domain) => this.http.post<UserAnimeRatesGQLResponse>(`${domain}/api/graphql`, { query })
                    .pipe(map(mapUserAnimeRatesGQL)),
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

    getUserRate(
        userId: ResourceIdType,
        targetId: ResourceIdType,
        targetType: UserRateTargetEnum,
    ): Observable<UserAnimeRate[]> {
        const params = new HttpParams()
            .set('user_id', userId)
            .set('target_type', targetType)
            .set('target_id', targetId);

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.get<UserAnimeRate[]>(`${domain}/api/v2/user_rates`, { params })),
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

    editComment(comment: Comment): Observable<Comment> {
        const body = {
            comment,
            frontend: false,
        };

        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.patch<Comment>(`${domain}/api/comments/${comment.id}`, body)),
        );
    }

    deleteComment(commentId: ResourceIdType): Observable<void> {
        return this.shikimoriDomain$.pipe(
            take(1),
            switchMap((domain) => this.http.delete<void>(`${domain}/api/comments/${commentId}`)),
        );
    }
}
