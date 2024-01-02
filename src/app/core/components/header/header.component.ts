import {
    BehaviorSubject,
    Observable,
    Subject,
    combineLatest,
} from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngrx/store';
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
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { authShikimoriAction } from '@app/store/auth/actions/auth.actions';
import {
    findAnimeAction,
    resetFoundAnimeAction,
} from '@app/store/shikimori/actions/find-anime.action';
import {
    selectShikimoriAnimeSearchLoading,
    selectShikimoriCurrentUser,
    selectShikimoriFoundAnimes,
} from '@app/store/shikimori/selectors/shikimori.selectors';
import { toBase64 } from '@app/shared/utils/base64-utils';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
    currentUser$: Observable<UserBriefInfoInterface>;
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
        private store: Store,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
    ) {}

    ngOnInit() {
        this.initializeValues();
    }

    initializeValues(): void {
        this.searchbarFocusedSubject$ = new BehaviorSubject<boolean>(false);
        this.currentUser$ = this.store.select(selectShikimoriCurrentUser);
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

    async openResult([result, target]: [ SearchbarResult, ResultOpenTarget ]): Promise<void> {
        this.isAnimeListPopoverOpen = false;

        if (target === 'internal') {
            await this.router.navigate(['/player', result.id]);
        } else {
            const extras: NavigationExtras = {
                queryParams: { link: toBase64('https://shikimori.one' + result.url) },
            };

            await this.router.navigate(['/external'], extras);
        }
    }
}
