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
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { getCurrentUserAction } from '@app/store/shikimori/actions/get-current-user.action';
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
    ) {}

    ngOnInit(): void {
        this.initTheme();
        this.initLocale();
        this.initUser();
        this.initOnNavigation();
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
}
