import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoService, getBrowserLang } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { addHours, compareAsc } from 'date-fns';
import {
    distinctUntilChanged,
    filter,
    tap,
} from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import { PersistenceService } from '@app/shared/services';
import { cacheHealthCheckUpAction, resetCacheAction } from '@app/store/cache/actions';
import { getCurrentUserAction } from '@app/store/shikimori/actions/get-current-user.action';
import { selectCacheLastCheckUp } from '@app/store/cache/selectors/cache.selectors';
import { selectLanguage, selectTheme } from '@app/store/settings/selectors/settings.selectors';
import { updateLanguageAction, visitPageAction } from '@app/store/settings/actions/settings.actions';

@UntilDestroy()
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    constructor(
        @Inject(DOCUMENT)
        private readonly _document: Document,
        private readonly _store: Store,
        private readonly _renderer: Renderer2,
        private readonly _transloco: TranslocoService,
        private readonly _router: Router,
        private readonly _persistenceService: PersistenceService,
    ) {}

    ngOnInit(): void {
        this.initTheme();
        this.initLocale();
        this.initUser();
        this.initOnNavigation();
        this.initCacheHealthCheckUp();
    }

    initLocale(): void {
        this._store.select(selectLanguage).pipe(
            tap((storedLanguage) => {
                const availableLangs = this._transloco.getAvailableLangs() as string[];
                const browserLang = getBrowserLang();
                const defaultLang = availableLangs.includes(browserLang)
                    ? browserLang
                    : 'en';
                const language = storedLanguage || defaultLang;

                this._renderer.setAttribute(this._document.documentElement, 'lang', language);
                this._store.dispatch(updateLanguageAction({ language }));
            }),
            untilDestroyed(this),
        ).subscribe();
    }

    initTheme(): void {
        this._store.select(selectTheme).pipe(
            distinctUntilChanged(),
            tap((theme) => {
                const darkThemeClass = 'ion-palette-dark';

                if (!theme || theme === 'dark') {
                    this._renderer.addClass(this._document.documentElement, darkThemeClass);
                } else {
                    this._renderer.removeClass(this._document.documentElement, darkThemeClass);
                }
            }),
            untilDestroyed(this),
        ).subscribe();
    }

    initUser(): void {
        this._store.dispatch(getCurrentUserAction());
    }

    initOnNavigation(): void {
        this._router.events
            .pipe(
                untilDestroyed(this),
                filter((event) => event instanceof NavigationEnd),
                filter<NavigationEnd>(({ url }) => url !== '/settings'),
                tap<NavigationEnd>(({ url }) => this._store.dispatch(visitPageAction({ url }))),
            )
            .subscribe();
    }

    async initCacheHealthCheckUp(): Promise<void> {
        const CRITICAL_USAGE_RATIO = 0.95;

        const HOURS_PER_CHECKS = 12;
        const NOW = new Date();

        const lastCheckUpTime = await firstValueFrom(this._store.select(selectCacheLastCheckUp));
        const plannedChechUpTime = addHours(lastCheckUpTime, HOURS_PER_CHECKS);
        const isDueTime = compareAsc(NOW, plannedChechUpTime) > 0;

        const usedCacheRatio = this._persistenceService.getCacheBytes() / this._persistenceService.getMaxByxes();
        const isCritical = usedCacheRatio > CRITICAL_USAGE_RATIO;

        if (isCritical) {
            console.warn('[Cache] Critical usage');

            this._store.dispatch(resetCacheAction());
        } else if (isDueTime) {
            console.info('[Cache] Performing check up');

            this._store.dispatch(cacheHealthCheckUpAction());
        } else {
            const usagePercent = (usedCacheRatio * 100).toFixed(2);

            console.info(`[Cache] Healthy, usage ratio ${usagePercent}%`);
        }
    }
}
