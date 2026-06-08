import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AnimeQueryFiltersInterface } from '@app/shared/types/shikicinema/v1/anime-filters.interface';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import {
    ShikicinemaAnime,
    ShikicinemaAnimeUserRate,
    ShikicinemaGenre,
    ShikicinemaStudio,
    ShikivideosInterface,
    UploadToken,
} from '@app/shared/types/shikicinema/v1';
import { VideoInfoInterface } from '@app/modules/player/types';
import { environment } from '@app-env/environment';
import { map } from 'rxjs';
import { mapVideoKindToShikicinema } from '@app/shared/utils/map-video-kind-to-shikicinema-v1.function';

@Injectable({
    providedIn: 'root',
})
export class ShikicinemaV1Client {
    private http = inject(HttpClient);

    private readonly baseUri = environment.smarthard.apiURI;
    private readonly clientId = environment.smarthard.authClientId;
    private readonly clientSecret = environment.smarthard.authClientSecret;

    findAnimes(animeId: string) {
        const url = `${this.baseUri}/api/shikivideos/${animeId}`;
        const params = new HttpParams()
            .set('limit', 'all');

        return this.http.get<ShikivideosInterface[]>(url, { params });
    }

    getUploadToken(shikimoriToken: string) {
        const url = `${this.baseUri}/oauth/token`;
        const params = new HttpParams()
            .set('grant_type', 'shikimori_token')
            .set('client_id', this.clientId)
            .set('client_secret', this.clientSecret)
            .set('scopes', 'database:shikivideos_create');
        const body = { shikimori_token: shikimoriToken };

        return this.http.put<UploadToken>(url, body, { params });
    }

    uploadVideo(animeId: ResourceIdType, video: VideoInfoInterface) {
        const url = `${this.baseUri}/api/shikivideos`;

        let params = new HttpParams()
            .set('anime_id', animeId)
            .set('episode', video.episode)
            .set('kind', mapVideoKindToShikicinema(video.kind))
            .set('language', video.language)
            .set('url', video.url);

        if (video.author) {
            params = params.set('author', video.author);
        }

        if (video.quality) {
            params = params.set('quality', video.quality);
        }

        return this.http.post<ShikivideosInterface>(url, null, { params });
    }

    getContributions(uploaderId: ResourceIdType, page = 1) {
        const limit = 100;
        const url = `${this.baseUri}/api/shikivideos/search`;
        let params = new HttpParams()
            .set('limit', limit)
            .set('uploader', uploaderId);

        if (page > 1) {
            params = params.set('offset', (page - 1) * limit);
        }

        return this.http.get<ShikivideosInterface[]>(url, { params });
    }

    getTotalContributions(uploaderId: ResourceIdType) {
        const url = `${this.baseUri}/api/shikivideos/contributions`;
        const params = new HttpParams()
            .set('uploader', uploaderId);

        return this.http.get(url, { params }).pipe(
            map((res: any) => res?.count as number),
        )
    }

    getAnimes(name?: string, filters: AnimeQueryFiltersInterface = {}) {
        let params = new HttpParams();

        const url = `${this.baseUri}/v1/api/animes`;
        const {
            genres = [],
            studios = [],
            kinds = [],
            statuses = [],
            ageRatings = [],
            sort,
            order,
        } = filters;

        if (name) {
            params = params.append('name', name);
        }

        for (const genreId of genres) {
            params = params.append('genres', genreId);
        }

        for (const studioId of studios) {
            params = params.append('studios', studioId);
        }

        for (const kind of kinds) {
            params = params.append('kinds', kind);
        }

        for (const status of statuses) {
            params = params.append('statuses', status);
        }

        for (const rating of ageRatings) {
            params = params.append('ageRatings', rating);
        }

        if (sort) params = params.set('sort', sort);
        if (order) params = params.set('order', order);

        return this.http.get<ShikicinemaAnime[]>(url, { params });
    }

    filterAnimes(
        userRates: ShikicinemaAnimeUserRate[],
        filters: AnimeQueryFiltersInterface = {},
    ) {
        const url = `${this.baseUri}/v1/api/animes/query`;

        return this.http.post<ShikicinemaAnime[]>(url, { userRates, ...filters });
    }

    getGenres() {
        const url = `${this.baseUri}/v1/api/genres`;

        return this.http.get<ShikicinemaGenre[]>(url);
    }

    getStudios(name?: string, limit = 10) {
        const url = `${this.baseUri}/v1/api/studios`;
        let params = new HttpParams();

        if (name) {
            params = params.set('name', name);
        }

        if (limit) {
            params = params.set('limit', limit);
        }

        return this.http.get<ShikicinemaStudio[]>(url, { params });
    }
}
