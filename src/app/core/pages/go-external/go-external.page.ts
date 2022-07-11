import { Component, Inject, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
    catchError,
    delay,
    map,
    pluck,
    take,
    tap,
} from 'rxjs/operators';

import { fromBase64 } from '@app/shared/utils/base64-utils';
import { PlatformApi } from '@app/shared/types/platform/platform-api';
import { PLATFORM_API_TOKEN } from '@app/shared/services/platform-api/platform-api.factory';

@Component({
    selector: 'app-go-external',
    templateUrl: './go-external.page.html',
    styleUrls: ['./go-external.page.scss'],
})
export class GoExternalPage implements OnInit {

    exLink$: Observable<string>;
    exDomain$: Observable<string>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject(PLATFORM_API_TOKEN) private platformApi: PlatformApi,
    ) { }

    ngOnInit() {
        this.initializeValues();
        this.initializeSubscriptions();
    }

    initializeValues(): void {
        this.exLink$ = this.route.queryParams.pipe(
            pluck('link'),
            map((b64EncodedLink) => fromBase64(b64EncodedLink)),
        );

        this.exDomain$ = this.exLink$.pipe(
            map((link) => new URL(link).hostname),
            catchError(() => EMPTY)
        );
    }

    initializeSubscriptions(): void {
        this.exLink$.pipe(
            take(1),
            delay(3000),
            tap(async (url) => {
                this.platformApi.openInBrowser(url, '_blank');
                await this.router.navigate([ '/home' ]);
            }),
        ).subscribe();
    }

}
