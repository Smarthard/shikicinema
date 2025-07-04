import { AsyncPipe, NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import {
    BehaviorSubject,
    Observable,
    Subject,
    combineLatest,
    firstValueFrom,
} from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    inject,
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
    IonTitle,
    IonToggle,
    IonToolbar,
} from '@ionic/angular/standalone';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    distinctUntilChanged,
    filter,
    map,
    shareReplay,
    take,
    tap,
} from 'rxjs/operators';

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
    selectShikimoriCurrentUserAvatar,
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
        IonTitle,
        IonSearchbar,
        IonButton,
        IonIcon,
        IonPopover,
        IonContent,
        IonList,
        IonItem,
        IonText,
        IonToggle,
        AsyncPipe,
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
export class HeaderComponent implements OnInit {
    private readonly store = inject(Store);
    private readonly router = inject(Router);
    private readonly transloco = inject(TranslocoService);
    private readonly breakpointObserver = inject(BreakpointObserver);

    private readonly shikimoriDomain = this.store.selectSignal(selectShikimoriDomain);

    readonly currentUser$ = this.store.select(selectShikimoriCurrentUser);
    readonly theme$ = this.store.select(selectTheme);
    readonly foundAnimes$ = this.store.select(selectShikimoriFoundAnimes);
    readonly isSearchResultsLoading$ = this.store.select(selectShikimoriAnimeSearchLoading);
    readonly avatarImg$ = this.store.select(selectShikimoriCurrentUserAvatar);
    readonly nickname$ = this.store.select(selectShikimoriCurrentUserNickname);
    readonly profileLink$ = this.store.select(selectShikimoriCurrentUserProfileLink);

    readonly availableLangs = this.transloco.getAvailableLangs() as string[];

    isAnimeListPopoverOpen: boolean;
    isSearchbarFocusedOnMobile$: Observable<boolean>;
    isSearchingInCyrillic: boolean;

    private searchbarFocusedSubject$: Subject<boolean>;

    ngOnInit() {
        this.initializeValues();
    }

    initializeValues(): void {
        this.searchbarFocusedSubject$ = new BehaviorSubject<boolean>(false);
        this.isAnimeListPopoverOpen = false;

        this.isSearchbarFocusedOnMobile$ = combineLatest([
            this.searchbarFocusedSubject$,
            this.breakpointObserver.observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
            ]),
        ]).pipe(
            map(([hasFocus, { matches }]) => hasFocus && matches),
            distinctUntilChanged(),
            shareReplay(1),
        );
    }

    toShikimoriProfilePage(): void {
        this.profileLink$.pipe(
            take(1),
            filter((profileLink) => !!profileLink),
            tap((profileLink) => window.open(profileLink)),
        ).subscribe();
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
        this.isAnimeListPopoverOpen = true;
        this.isSearchingInCyrillic = /[а-яё]+/i.test(searchStr);
    }

    onSearchbarFocusChange(hasFocus: boolean): void {
        this.searchbarFocusedSubject$.next(hasFocus);
    }

    async openResult([result, target]: [SearchbarResult, ResultOpenTarget]): Promise<void> {
        const shikimoriDomain = this.shikimoriDomain();
        this.isAnimeListPopoverOpen = false;

        if (target === 'internal') {
            await this.router.navigate(['/player', result.id]);
        } else {
            const extras: NavigationExtras = {
                queryParams: { link: toBase64(shikimoriDomain + result.url) },
            };

            await this.router.navigate(['/external'], extras);
        }
    }

    async onChangeTheme(): Promise<void> {
        const currentTheme = await firstValueFrom(this.theme$);
        const theme = currentTheme === 'dark' ? 'light' : 'dark';

        this.store.dispatch(updateThemeAction({ theme }));
    }

    onChangeLanguage(language: string): void {
        this.store.dispatch(updateLanguageAction({ language }));
    }
}
