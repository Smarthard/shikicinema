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
    Inject,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import {
    distinctUntilChanged,
    filter,
    map,
    shareReplay,
    take,
    tap,
} from 'rxjs/operators';

import { AnimeBriefInfoInterface } from '@app/shared/types/shikimori/anime-brief-info.interface';
import { NavigationExtras, Router } from '@angular/router';
import { ResultOpenTarget, SearchbarResult } from '@app/shared/types/searchbar.types';
import { SHIKIMORI_DOMAIN_TOKEN } from '@app/core/providers/shikimori-domain';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { authShikimoriAction, logoutShikimoriAction } from '@app/store/auth/actions/auth.actions';
import {
    findAnimeAction,
    resetFoundAnimeAction,
} from '@app/store/shikimori/actions/find-anime.action';
import {
    selectShikimoriAnimeSearchLoading,
    selectShikimoriCurrentUser,
    selectShikimoriFoundAnimes,
} from '@app/store/shikimori/selectors/shikimori.selectors';
import { selectTheme } from '@app/store/settings/selectors/settings.selectors';
import { toBase64 } from '@app/shared/utils/base64-utils';
import { updateLanguageAction, updateThemeAction } from '@app-root/app/store/settings/actions/settings.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
    readonly availableLangs = this.transloco.getAvailableLangs() as string[];

    currentUser$: Observable<UserBriefInfoInterface>;
    theme$: Observable<string>;
    avatarImg$: Observable<string>;
    nickname$: Observable<string>;
    profileLink$: Observable<string>;
    foundAnimes$: Observable<AnimeBriefInfoInterface[]>;
    isSearchResultsLoading$: Observable<boolean>;
    isAnimeListPopoverOpen: boolean;
    isSearchbarFocusedOnMobile$: Observable<boolean>;
    isSearchingInCyrillic: boolean;

    private searchbarFocusedSubject$: Subject<boolean>;

    constructor(
        @Inject(SHIKIMORI_DOMAIN_TOKEN)
        private shikimoriDomain$: Observable<string>,
        private store: Store,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private transloco: TranslocoService,
    ) {}

    ngOnInit() {
        this.initializeValues();
    }

    initializeValues(): void {
        this.searchbarFocusedSubject$ = new BehaviorSubject<boolean>(false);
        this.currentUser$ = this.store.select(selectShikimoriCurrentUser);
        this.theme$ = this.store.select(selectTheme);
        this.foundAnimes$ = this.store.select(selectShikimoriFoundAnimes);
        this.isSearchResultsLoading$ = this.store.select(selectShikimoriAnimeSearchLoading);
        this.avatarImg$ = this.currentUser$.pipe(map((user) => user?.image?.x64 || user?.avatar));
        this.nickname$ = this.currentUser$.pipe(map((user) => user?.nickname));
        this.profileLink$ = this.currentUser$.pipe(map((user) => user?.url));
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
        const shikimoriDomain = await firstValueFrom(this.shikimoriDomain$);
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
