import { Component, OnInit } from '@angular/core';
import { getBrowserLang } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { updateSettingsAction } from '@app/store/settings/actions/settings.actions';
import { languageSelector } from '@app/store/settings/selectors/settings.selectors';
import { getCurrentUserAction } from '@app/store/shikimori/actions/get-current-user.action';

@UntilDestroy()
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor(
        private store$: Store,
    ) {}

    ngOnInit(): void {
        this.initializeLocale();
        this.initializeUser();
    }

    initializeLocale(): void {
        this.store$.pipe(
            untilDestroyed(this),
            select(languageSelector),
            tap((storedLanguage) => {
                const browserLang = getBrowserLang();
                const language = storedLanguage || browserLang || 'en';

                if (language !== storedLanguage) {
                    this.store$.dispatch(updateSettingsAction({ config: { language } }));
                }
            })
        ).subscribe();
    }

    initializeUser(): void {
        this.store$.dispatch(getCurrentUserAction());
    }
}
