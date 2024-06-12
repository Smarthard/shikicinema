import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ShikivideosInterface } from '@app/shared/types/shikicinema/v1';
import { environment } from '@app-env/environment';

@Injectable({
    providedIn: 'root',
})
export class ShikicinemaV1ClientService {
    private readonly baseUri = environment.smarthard.apiURI;

    constructor(
        private http: HttpClient,
    ) {}

    findAnimes(animeId: string) {
        const url = `${this.baseUri}/api/shikivideos/${animeId}`;
        const params = new HttpParams()
            .set('limit', 'all');

        return this.http.get<ShikivideosInterface[]>(url, { params });
    }
}
