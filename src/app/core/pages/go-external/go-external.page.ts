import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import {
    catchError,
    delay,
    map,
    pluck,
    take,
    tap,
} from 'rxjs/operators';

import { PLATFORM_API_TOKEN } from '@app/shared/services/platform-api/platform-api.factory';
import { PlatformApi } from '@app/shared/types/platform/platform-api';
import { fromBase64 } from '@app/shared/utils/base64-utils';

@Component({
    selector: 'app-go-external',
    templateUrl: './go-external.page.html',
    styleUrls: ['./go-external.page.scss'],
    imports: [
        IonContent,
        IonSpinner,
        TranslocoPipe,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class GoExternalPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private platformApi = inject<PlatformApi>(PLATFORM_API_TOKEN);

    exLink$: Observable<string>;
    exDomain$: Observable<string>;

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
            catchError(() => EMPTY),
        );
    }

    initializeSubscriptions(): void {
        this.exLink$.pipe(
            take(1),
            delay(3000),
            tap(async (url) => {
                this.platformApi.openInBrowser(url, '_blank');
                await this.router.navigate(['/home']);
            }),
        ).subscribe();
    }
}
