import { Component, OnInit } from '@angular/core';
import { getBrowserLang, TranslocoService } from '@ngneat/transloco';
import { Storage } from '@ionic/storage-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs/operators';

@UntilDestroy()
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        private translate: TranslocoService,
        private storage: Storage,
    ) {}

    async ngOnInit(): Promise<void> {
        await this.init();
        await this.initializeLocale();
    }

    async init(): Promise<void> {
        await this.storage.create();
    }

    async initializeLocale(): Promise<void> {
        const browserLang = getBrowserLang();
        const supportedLangs = this.translate.getAvailableLangs() as string[];
        let storedLanguage: string = await this.storage.get('Accept-Language');

        if (!supportedLangs.includes(storedLanguage)) {
            storedLanguage = null;
        }

        const language = storedLanguage || browserLang || 'en';

        this.translate.setActiveLang(language);
        this.translate.langChanges$
            .pipe(
                untilDestroyed(this),
                tap((lang) => this.storage.set('Accept-Language', lang))
            )
            .subscribe();
    }
}
