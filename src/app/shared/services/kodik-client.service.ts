import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { KodikAnimeInfo, KodikApiResponse } from '@app/shared/types/kodik';
import { environment } from '@app-env/environment';

@Injectable({
    providedIn: 'root',
})
export class KodikClient {
    private http = inject(HttpClient);

    readonly baseUri = environment.kodik.apiURI;
    readonly token = environment.kodik.authToken;

    findAnimes(animeId: string) {
        const url = `${this.baseUri}/search`;
        const params = new HttpParams()
            .set('token', this.token)
            .set('shikimori_id', animeId)
            .set('with_episodes', true);

        return this.http.get<KodikApiResponse<KodikAnimeInfo>>(url, { params });
    }
}
