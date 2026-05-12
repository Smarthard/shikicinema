import { ActivatedRoute } from '@angular/router';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    computed,
    inject,
} from '@angular/core';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { take, tap } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

import { PLATFORM_API_TOKEN } from '@app/shared/services/platform-api/platform-api.factory';
import { PlatformApi } from '@app/shared/types/platform/platform-api';
import { environment } from '@app-env/environment';
import { fromBase64 } from '@app/shared/utils/base64-utils';

@Component({
    selector: 'app-go-external',
    templateUrl: './go-external.page.html',
    styleUrls: ['./go-external.page.scss'],
    imports: [
        IonContent,
        IonSpinner,
        TranslocoPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class GoExternalPage implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly platformApi = inject<PlatformApi>(PLATFORM_API_TOKEN);

    private readonly isInstant = environment.target === 'web-extension';

    readonly query = toSignal(this.route.queryParams);
    readonly link = computed<string>(() => fromBase64(this.query()?.['link']));
    readonly target = computed<string>(() => this.query()?.['target'] || '_blank');
    readonly domain = computed(() => new URL(this.link()).hostname);

    private openExternalPage(): void {
        this.platformApi.openInBrowser(this.link(), this.target());

        if (this.target() !== '_self') {
            this.location.back();
        }
    }

    ngOnInit() {
        if (this.isInstant) {
            this.openExternalPage();
        } else {
            timer(3000)
                .pipe(
                    take(1),
                    tap(() => this.openExternalPage()),
                    takeUntilDestroyed(),
                )
                .subscribe();
        }
    }
}
