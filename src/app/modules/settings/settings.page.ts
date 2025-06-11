import { AsyncPipe, UpperCasePipe } from '@angular/common';
import {
    BehaviorSubject,
    filter,
    firstValueFrom,
    tap,
} from 'rxjs';
import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    OnInit,
    ViewEncapsulation,
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
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { GetShikimoriPagePipe } from '@app/shared/pipes/get-shikimori-page/get-shikimori-page.pipe';
import { PersistenceService } from '@app/shared/services/persistence.service';
import { PlayerKindDisplayMode } from '@app/store/settings/types/player-kind-display-mode.type';
import { PlayerModeType } from '@app/store/settings/types/player-mode.type';
import { ProfileInfoComponent } from '@app/modules/settings/components/profile-info/profile-info.component';
import { Router } from '@angular/router';
import { SettingsGroupComponent } from '@app/modules/settings/components/settings-group/settings-group.component';
import { ThemeSettingsType } from '@app/store/settings/types/theme-settings.type';
import { ToHumanReadableBytesPipe } from '@app/shared/pipes/to-human-readable-bytes/to-human-readable-bytes.pipe';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { authShikimoriAction, logoutShikimoriAction } from '@app/store/auth/actions/auth.actions';
import { resetCacheAction } from '@app/store/cache/actions';
import { selectLastVisitedPage, selectSettings } from '@app/store/settings/selectors/settings.selectors';
import {
    selectShikimoriCurrentUser,
    selectShikimoriCurrentUserAvatarHiRes,
    selectShikimoriCurrentUserNickname,
} from '@app/store/shikimori/selectors/shikimori.selectors';
import { updateSettingsAction } from '@app/store/settings/actions/settings.actions';


@UntilDestroy()
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

    readonly settings$ = this.store.select(selectSettings);
    readonly lastVisitedPage$ = this.store.select(selectLastVisitedPage);

    readonly hasLastVisitedPage$ = this.lastVisitedPage$.pipe(
        filter((url) => url && url !== '/settings'),
    );

    readonly availableLangs = this.transloco.getAvailableLangs() as string[];

    readonly settingsForm = new FormGroup({
        language: new FormControl<string>('en', [Validators.required]),
        theme: new FormControl<ThemeSettingsType>('dark', [Validators.required]),
        customTheme: new FormControl<string>(''),
        preferencesToggle: new FormControl<boolean>(true),
        playerMode: new FormControl<PlayerModeType>('auto'),
        playerKindDisplayMode: new FormControl<PlayerKindDisplayMode>('special-only'),
    });

    readonly themeCtrl = this.settingsForm?.get('theme');
    readonly playerModeCtrl = this.settingsForm?.get('playerMode');
    readonly playerKindDisplayModeCtrl = this.settingsForm?.get('playerKindDisplayMode');

    readonly shikimoriUser$ = this.store.select(selectShikimoriCurrentUser);
    readonly shikimoriAvatarImg$ = this.store.select(selectShikimoriCurrentUserAvatarHiRes);
    readonly shikimoriNickname$ = this.store.select(selectShikimoriCurrentUserNickname);

    readonly localStorageLimit = this.persistenceService.getMaxByxes();
    readonly localStorageUsage$ = new BehaviorSubject(this.persistenceService.getUsedBytes());
    readonly localStorageCache$ = new BehaviorSubject(this.persistenceService.getCacheBytes());

    async initValues(): Promise<void> {
        const savedSettings = await firstValueFrom(this.settings$);
        const title = await firstValueFrom(this.transloco.selectTranslate('SETTINGS_MODULE.SETTINGS_PAGE.PAGE_TITLE'));

        this.title.setTitle(title);

        this.settingsForm.patchValue(savedSettings);
    }

    async initSubscriptions(): Promise<void> {
        this.settingsForm.valueChanges
            .pipe(
                untilDestroyed(this),
                tap((form) => this.store.dispatch(updateSettingsAction({ config: form }))),
            )
            .subscribe();
    }

    async ngOnInit(): Promise<void> {
        await this.initValues();
        await this.initSubscriptions();
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

    async goToLastPage(): Promise<void> {
        const lastPage = await firstValueFrom(this.lastVisitedPage$);

        await this.router.navigateByUrl(lastPage);
    }
}
