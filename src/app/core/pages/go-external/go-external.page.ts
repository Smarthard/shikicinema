import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';
import {
    catchError,
    delay,
    map,
    pluck,
    take,
    tap,
} from 'rxjs/operators';

import { fromBase64 } from '@app/shared/utils/base64-utils';

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
            tap((url) => Browser.open({ url, windowName: '_self' })),
        ).subscribe();
    }

}
