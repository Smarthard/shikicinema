import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    Renderer2,
    ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { getBrowserLang } from '@ngneat/transloco';

import { getCurrentUserAction } from '@app/store/shikimori/actions/get-current-user.action';
import { selectLanguage, selectTheme } from '@app/store/settings/selectors/settings.selectors';
import { updateLanguageAction } from '@app/store/settings/actions/settings.actions';

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
    ) {}

    ngOnInit(): void {
        this.initTheme();
        this.initLocale();
        this.initUser();
    }

    initLocale(): void {
        this._store.select(selectLanguage).pipe(
            tap((storedLanguage) => {
                const browserLang = getBrowserLang();
                const language = storedLanguage || browserLang || 'en';

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
}
