import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { BehaviorSubject, first, tap } from 'rxjs';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    HostBinding,
    OnInit,
    ViewEncapsulation,
    computed,
    inject,
} from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    IonButton,
    IonContent,
    IonIcon,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToggle,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DEFAULT_SHIKIMORI_DOMAIN_TOKEN, SHIKIMORI_DOMAINS } from '@app/core/providers/shikimori-domain';
import { GetShikimoriPagePipe } from '@app/shared/pipes/get-shikimori-page/get-shikimori-page.pipe';
import { PersistenceService } from '@app/shared/services/persistence.service';
import { PlayerKindDisplayMode } from '@app/store/settings/types/player-kind-display-mode.type';
import { PlayerModeType } from '@app/store/settings/types/player-mode.type';
import { ProfileInfoComponent } from '@app/modules/settings/components/profile-info/profile-info.component';
import { SettingsGroupComponent } from '@app/modules/settings/components/settings-group/settings-group.component';
import { ThemeSettingsType } from '@app/store/settings/types/theme-settings.type';
import { ToHumanReadableBytesPipe } from '@app/shared/pipes/to-human-readable-bytes/to-human-readable-bytes.pipe';
import { authShikimoriAction, logoutShikimoriAction } from '@app/store/auth/actions/auth.actions';
import { mapSettinsFormToState } from '@app/modules/settings/utils';
import { resetCacheAction } from '@app/store/cache/actions';
import { selectIsAuthenticated } from '@app/store/auth/selectors/auth.selectors';
import { selectLastVisitedPage, selectSettings } from '@app/store/settings/selectors/settings.selectors';
import {
    selectShikimoriCurrentUserAvatarHiRes,
    selectShikimoriCurrentUserNickname,
    selectShikimoriDomain,
} from '@app/store/shikimori/selectors/shikimori.selectors';
import { updateSettingsAction } from '@app/store/settings/actions/settings.actions';
import { updateShikimoriDomainAction } from '@app/store/shikimori/actions';


@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        AsyncPipe,
        UpperCasePipe,
        TranslocoPipe,
        GetShikimoriPagePipe,
        FormsModule,
        ReactiveFormsModule,
        IonContent,
        IonSelect,
        IonSelectOption,
        IonToggle,
        IonProgressBar,
        IonButton,
        IonIcon,
        IonTextarea,
        SettingsGroupComponent,
        ProfileInfoComponent,
        ToHumanReadableBytesPipe,
    ],
    templateUrl: 'settings.page.html',
    styleUrl: 'settings.page.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage implements OnInit {
    @HostBinding('class.settings-page')
    private settingsPageClass = true;

    private readonly transloco = inject(TranslocoService);
    private readonly title = inject(Title);
    private readonly store = inject(Store);
    private readonly persistenceService = inject(PersistenceService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly defaultShikimoriDomain = inject(DEFAULT_SHIKIMORI_DOMAIN_TOKEN);

    readonly settings = this.store.selectSignal(selectSettings);
    readonly lastVisitedPage = this.store.selectSignal(selectLastVisitedPage);

    readonly isShikimoriAuthenticated = this.store.selectSignal(selectIsAuthenticated);
    readonly shikimoriAvatarImg = this.store.selectSignal(selectShikimoriCurrentUserAvatarHiRes);
    readonly shikimoriNickname = this.store.selectSignal(selectShikimoriCurrentUserNickname);

    readonly hasLastVisitedPage = computed(() => {
        const page = this.lastVisitedPage();

        return Boolean(page && page !== '/settings');
    });

    readonly availableLangs = this.transloco.getAvailableLangs() as string[];
    readonly shikimoriDomains = SHIKIMORI_DOMAINS;

    readonly settingsForm = new FormGroup({
        language: new FormControl<string>('en', [Validators.required]),
        theme: new FormControl<ThemeSettingsType>('dark', [Validators.required]),
        customTheme: new FormControl<string>(''),
        preferencesToggle: new FormControl<boolean>(true),
        playerMode: new FormControl<PlayerModeType>('auto'),
        playerKindDisplayMode: new FormControl<PlayerKindDisplayMode>('special-only'),
        shikimoriDomain: new FormControl<string>(this.defaultShikimoriDomain),
    });

    readonly themeCtrl = this.settingsForm?.get('theme');
    readonly playerModeCtrl = this.settingsForm?.get('playerMode');
    readonly playerKindDisplayModeCtrl = this.settingsForm?.get('playerKindDisplayMode');
    readonly shikimoriDomainCtrl = this.settingsForm?.get('shikimoriDomain');

    readonly localStorageLimit = this.persistenceService.getMaxByxes();
    readonly localStorageUsage$ = new BehaviorSubject(this.persistenceService.getUsedBytes());
    readonly localStorageCache$ = new BehaviorSubject(this.persistenceService.getCacheBytes());

    initPageTitle(): void {
        this.transloco.selectTranslate<string>('SETTINGS_MODULE.SETTINGS_PAGE.PAGE_TITLE')
            .pipe(
                first(Boolean),
                tap((title) => this.title.setTitle(title)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    initForm(): void {
        this.settingsForm.patchValue(this.settings());

        this.store.select(selectShikimoriDomain)
            .pipe(
                first(Boolean),
                tap((domain) => this.shikimoriDomainCtrl.patchValue(domain)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    initSettingsAutoUpdate(): void {
        this.settingsForm.valueChanges
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                tap((form) => {
                    if (this.settingsForm.valid) {
                        const domain = this.shikimoriDomainCtrl.value;

                        this.store.dispatch(updateSettingsAction({ config: mapSettinsFormToState(form) }));
                        this.store.dispatch(updateShikimoriDomainAction({ domain }));
                    };
                }),
            )
            .subscribe();
    }

    ngOnInit(): void {
        this.initPageTitle();
        this.initForm();
        this.initSettingsAutoUpdate();
    }

    shikimoriLogin(): void {
        this.store.dispatch(authShikimoriAction());
    }

    shikimoriLogout(): void {
        this.store.dispatch(logoutShikimoriAction());
    }

    clearCache(): void {
        this.store.dispatch(resetCacheAction());
        this.localStorageCache$.next(this.persistenceService.getCacheBytes());
    }

    goToLastPage(): void {
        this.router.navigateByUrl(this.lastVisitedPage());
    }
}
