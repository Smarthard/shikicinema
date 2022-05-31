import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '@app-env/environment';
import { UserInterface } from '@app/shared/types/shikimori/user.interface';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { UserBriefRateInterface } from '@app/shared/types/shikimori/user-brief-rate.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

@Injectable({
    providedIn: 'root'
})
export class ShikimoriClient {
    readonly baseUri = environment.shikimori.apiURI;

    constructor(
        private http: HttpClient,
    ) {}

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

    getUserAnimeRates(userId: ResourceIdType) {
        const url = `${this.baseUri}/users/${userId}/anime_rates`;
        const params = new HttpParams()
            .set('limit', 1000)
            .set('order', 'name');

        return this.http.get<UserAnimeRate[]>(url, { params });
    }
}
