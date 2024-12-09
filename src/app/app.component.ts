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
import { getBrowserLang } from '@ngneat/transloco';
import { tap } from 'rxjs/operators';

import { getCurrentUserAction } from '@app/store/shikimori/actions/get-current-user.action';
import { selectLanguage } from '@app/store/settings/selectors/settings.selectors';
import { updateSettingsAction } from '@app/store/settings/actions/settings.actions';

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
        this.initializeLocale();
        this.initializeUser();
    }

    initializeLocale(): void {
        this._store.select(selectLanguage).pipe(
            untilDestroyed(this),
            tap((storedLanguage) => {
                const browserLang = getBrowserLang();
                const language = storedLanguage || browserLang || 'en';

                this._renderer.setAttribute(this._document.documentElement, 'lang', language);
                this._store.dispatch(updateSettingsAction({ config: { language } }));
            }),
        ).subscribe();
    }

    initializeUser(): void {
        this._store.dispatch(getCurrentUserAction());
    }
}
