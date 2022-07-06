import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@app-env/environment';
import { UserInterface } from '@app/shared/types/shikimori/user.interface';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { UserBriefRateInterface } from '@app/shared/types/shikimori/user-brief-rate.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserAnimeRatesQuery } from '@app/shared/types/shikimori/queries/user-anime-rates-query';
import { setPaginationToParams } from '@app/shared/types/shikimori/helpers/pagination-helper';
import { Credentials } from '@app/shared/types/shikimori/credentials';
import { toShikimoriCredentials } from '@app/shared/types/shikimori/mappers/auth.mappers';

@Injectable({
    providedIn: 'root'
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

        return this.http.post<Credentials>('https://shikimori.one/oauth/token', null,{ params })
            .pipe(map(toShikimoriCredentials));
    }

    getCurrentUser() {
        const url = `${this.baseUri}/users/whoami`;

        return this.http.get<UserBriefInfoInterface>(url);
    }

    /**
     * @description get full info about shikimori user
     * @see less info about user here - [getUserBriefInfo]{@link ShikimoriClient#getUserBriefInfo}
     */
    getUser(idOrUsername: ResourceIdType) {
        const url = `${this.baseUri}/users/${idOrUsername}`;

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
     */
    getUserBriefInfo(idOrUsername: ResourceIdType) {
        const url = `${this.baseUri}/users/${idOrUsername}/info`;

        return this.http.get<UserBriefInfoInterface>(url);
    }

    getUserRates(userId?: ResourceIdType) {
        const url = `${this.baseUri}/v2/user_rates`;
        let params = new HttpParams();

        if (userId) {
            params = params.set('user_id ', userId);
        }

        return this.http.get<UserBriefRateInterface[]>(url, { params });
    }

    getUserAnimeRates(userId: ResourceIdType, query?: UserAnimeRatesQuery) {
        const url = `${this.baseUri}/users/${userId}/anime_rates`;
        let params = setPaginationToParams(query);

        if (query?.censored) {
            params = params.set('censored', query.censored);
        }

        if (query?.status) {
            params = params.set('status', query.status);
        }

        return this.http.get<UserAnimeRate[]>(url, { params });
    }
}
