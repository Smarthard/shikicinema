import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { Comment } from '@app/shared/types/shikimori/comment';
import { Credentials } from '@app/shared/types/shikimori/credentials';
import { FindAnimeQuery } from '@app/shared/types/shikimori/queries/find-anime-query';
import { Observable } from 'rxjs';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
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
    readonly baseUri = environment.shikimori.apiURI;

    constructor(
        private http: HttpClient,
    ) {}

    getNewToken(authCode: string) {
        const params = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('client_id', environment.shikimori.authClientId)
            .set('client_secret', environment.shikimori.authClientSecret)
            .set('code', authCode)
            .set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

        return this.http.post<Credentials>('https://shikimori.one/oauth/token', null, { params })
            .pipe(map(toShikimoriCredentials));
    }

    refreshToken(refreshToken: string) {
        const params = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('client_id', environment.shikimori.authClientId)
            .set('client_secret', environment.shikimori.authClientSecret)
            .set('refresh_token', refreshToken);

        return this.http.post<Credentials>('https://shikimori.one/oauth/token', null, { params })
            .pipe(map(toShikimoriCredentials));
    }

    getCurrentUser() {
        const url = `${this.baseUri}/api/users/whoami`;

        return this.http.get<UserBriefInfoInterface>(url);
    }

    /**
     * @description get full info about shikimori user
     * @see less info about user here - [getUserBriefInfo]{@link ShikimoriClient#getUserBriefInfo}
     *
     * @param {string} idOrUsername shikimori user's id or nickname
     * @return {Observable} shikimori user info by id or nickname
     */
    getUser(idOrUsername: ResourceIdType): Observable<UserInterface> {
        const url = `${this.baseUri}/api/users/${idOrUsername}`;

        return this.http.get<UserInterface>(url);
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
        const url = `${this.baseUri}/api/users/${idOrUsername}/info`;

        return this.http.get<UserBriefInfoInterface>(url);
    }

    getUserRates(userId?: ResourceIdType) {
        const url = `${this.baseUri}/api/v2/user_rates`;
        let params = new HttpParams();

        if (userId) {
            params = params.set('user_id', userId);
        }

        return this.http.get<UserBriefRateInterface[]>(url, { params });
    }

    getUserAnimeRates(userId: ResourceIdType, query?: UserAnimeRatesQuery) {
        const url = `${this.baseUri}/api/users/${userId}/anime_rates`;
        let params = setPaginationToParams(query);

        if (query?.censored) {
            params = params.set('censored', query.censored);
        }

        if (query?.status) {
            params = params.set('status', query.status);
        }

        return this.http.get<UserAnimeRate[]>(url, { params });
    }

    findAnimes(query?: FindAnimeQuery) {
        const url = `${this.baseUri}/api/animes`;
        let params = setPaginationToParams(query);

        if (query?.search) {
            params = params.set('search', query.search);
        }

        return this.http.get<AnimeBriefInfoInterface[]>(url, { params });
    }

    getAnimeInfo(animeId: string) {
        const url = `${this.baseUri}/api/animes/${animeId}`;

        return this.http.get<AnimeBriefInfoInterface>(url);
    }

    createUserRate(userRates: Partial<UserAnimeRate>) {
        const url = `${this.baseUri}/api/v2/user_rates`;

        return this.http.post<UserAnimeRate>(url, userRates);
    }

    updateUserRate(userRates: Partial<UserAnimeRate>) {
        const url = `${this.baseUri}/api/v2/user_rates/${userRates?.id}`;

        return this.http.patch<UserAnimeRate>(url, userRates);
    }

    getTopics(animeId: number, episode?: number, revalidate = true) {
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

        return this.http.get<Topic[]>(`${this.baseUri}/api/animes/${animeId}/topics`, { params, headers });
    }

    getComments(commentableId: number, page = 1, limit = 30, desc: '0' | '1' = '0') {
        let params = new HttpParams()
            .set('commentable_id', `${commentableId}`)
            .set('commentable_type', 'Topic')
            .set('page', `${page}`)
            .set('limit', `${limit}`);

        if (desc) {
            params = params.set('desc', desc);
        }

        return this.http.get<Comment[]>(`${this.baseUri}/api/comments`, { params });
    }
}
