import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    inject,
    signal,
} from '@angular/core';
import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonPopover,
    IonSearchbar,
    IonText,
    IonToggle,
    IonToolbar,
} from '@ionic/angular/standalone';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { B64encodePipe } from '@app/shared/pipes/base64/b64encode.pipe';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { SearchbarResultsComponent } from '@app/core/components/searchbar-results/searchbar-results.component';
import { authShikimoriAction, logoutShikimoriAction } from '@app/store/auth/actions/auth.actions';
import {
    findAnimeAction,
    resetFoundAnimeAction,
} from '@app/store/shikimori/actions';
import {
    selectShikimoriAnimeSearchLoading,
    selectShikimoriCurrentUser,
    selectShikimoriCurrentUserAvatarHiRes,
    selectShikimoriCurrentUserNickname,
    selectShikimoriCurrentUserProfileLink,
    selectShikimoriDomain,
    selectShikimoriFoundAnimes,
} from '@app/store/shikimori/selectors';
import { selectTheme } from '@app/store/settings/selectors/settings.selectors';
import { toBase64 } from '@app/shared/utils/base64-utils';
import { updateLanguageAction, updateThemeAction } from '@app-root/app/store/settings/actions/settings.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        IonHeader,
        IonToolbar,
        IonSearchbar,
        IonButton,
        IonIcon,
        IonPopover,
        IonContent,
        IonList,
        IonItem,
        IonText,
        IonToggle,
        RouterLink,
        UpperCasePipe,
        TranslocoPipe,
        B64encodePipe,
        SearchbarResultsComponent,
        NgTemplateOutlet,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
    private readonly store = inject(Store);
    private readonly router = inject(Router);
    private readonly transloco = inject(TranslocoService);

    private readonly shikimoriDomain = this.store.selectSignal(selectShikimoriDomain);

    readonly currentUser = this.store.selectSignal(selectShikimoriCurrentUser);
    readonly theme = this.store.selectSignal(selectTheme);
    readonly foundAnimes = this.store.selectSignal(selectShikimoriFoundAnimes);
    readonly isSearchResultsLoading = this.store.selectSignal(selectShikimoriAnimeSearchLoading);
    readonly avatarImg = this.store.selectSignal(selectShikimoriCurrentUserAvatarHiRes);
    readonly nickname = this.store.selectSignal(selectShikimoriCurrentUserNickname);
    readonly profileLink = this.store.selectSignal(selectShikimoriCurrentUserProfileLink);

    readonly availableLangs = this.transloco.getAvailableLangs() as string[];

    readonly isAnimeListPopoverOpen = signal(false);
    readonly isSearchingInCyrillic = signal(false);

    toShikimoriProfilePage(): void {
        if (this.profileLink()) {
            // TODO: для native-app это не нужно
            window.open(this.profileLink());
        }
    }

    shikimoriLogin(): void {
        this.store.dispatch(authShikimoriAction());
    }

    shikimoriLogout(): void {
        this.store.dispatch(logoutShikimoriAction());
    }

    onAnimeSearch(evt): void {
        const searchStr = evt?.detail?.value;
        const action = searchStr ? findAnimeAction({ searchStr }) : resetFoundAnimeAction();

        this.store.dispatch(action);

        if (searchStr) {
            const isCyrillic = /[а-яё]+/i.test(searchStr);

            this.isAnimeListPopoverOpen.set(true);
            this.isSearchingInCyrillic.set(isCyrillic);
        }
    }

    async openResult([result, target]: [SearchbarResult, ResultOpenTarget]): Promise<void> {
        this.isAnimeListPopoverOpen.set(false);

        if (target === 'internal') {
            await this.router.navigate(['/player', result.id]);
        } else {
            const extras: NavigationExtras = {
                queryParams: { link: toBase64(this.shikimoriDomain() + result.url) },
            };

            await this.router.navigate(['/external'], extras);
        }
    }

    async onChangeTheme(): Promise<void> {
        const theme = this.theme() === 'dark' ? 'light' : 'dark';

        this.store.dispatch(updateThemeAction({ theme }));
    }

    onChangeLanguage(language: string): void {
        this.store.dispatch(updateLanguageAction({ language }));
    }
}
