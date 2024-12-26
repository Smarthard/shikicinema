import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { ShikivideosInterface, UploadToken } from '@app/shared/types/shikicinema/v1';
import { VideoInfoInterface } from '@app/modules/player/types';
import { environment } from '@app-env/environment';
import { mapVideoKindToShikicinema } from '@app/shared/utils/map-video-kind-to-shikicinema-v1.function';

@Injectable({
    providedIn: 'root',
})
export class ShikicinemaV1Client {
    private readonly baseUri = environment.smarthard.apiURI;
    private readonly clientId = environment.smarthard.authClientId;
    private readonly clientSecret = environment.smarthard.authClientSecret;

    constructor(
        private http: HttpClient,
    ) {}

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
}
