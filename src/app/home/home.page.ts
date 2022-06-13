import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, skipWhile, take, tap, withLatestFrom } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import { AnimeGridInterface } from '@app/home/types/anime-grid.interface';
import { VisibilityChangeInterface } from '@app/home/types/visibility-change.interface';
import { loadAnimeRateByStatusAction } from '@app/home/store/anime-rates/actions/load-anime-rate.action';
import { shikimoriCurrentUserSelector } from '@app/store/shikimori/selectors/shikimori.selectors';
import {
    isRatesLoadedByStatusSelector,
    ratesByStatusSelector,
} from '@app/home/store/anime-rates/selectors/anime-rates.selectors';

@UntilDestroy()
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    currentUser$: Observable<UserBriefInfoInterface>;

    planned$: Observable<UserAnimeRate[]>;
    watching$: Observable<UserAnimeRate[]>;
    rewatching$: Observable<UserAnimeRate[]>;
    completed$: Observable<UserAnimeRate[]>;
    onHold$: Observable<UserAnimeRate[]>;
    dropped$: Observable<UserAnimeRate[]>;

    isPlannedLoaded$: Observable<boolean>;
    isWatchingLoaded$: Observable<boolean>;
    isRewatchingLoaded$: Observable<boolean>;
    isCompletedLoaded$: Observable<boolean>;
    isOnHoldLoaded$: Observable<boolean>;
    isDroppedLoaded$: Observable<boolean>;

    animeGrids: AnimeGridInterface[];

    hiddenGridMap: Map<UserRateStatusType, boolean>;

    cardHeight: string;
    cardWidth: string;

    sectionVisibilitySubject$: Subject<VisibilityChangeInterface>;

    constructor(
        private readonly breakpointObserver: BreakpointObserver,
        private readonly store$: Store,
    ) {}

    ngOnInit() {
        this.initializeValues();
        this.initializeSubscriptions();
    }

    initializeSubscriptions(): void {
        this.currentUser$
            .pipe(
                untilDestroyed(this),
                skipWhile((currentUser) => !currentUser?.id),
                take(1),
                tap((currentUser) => this.getUserAnimeRatesByStatus(currentUser.id, 'planned')),
            )
            .subscribe();

        this.sectionVisibilitySubject$
            .pipe(
                untilDestroyed(this),
                filter(({ isVisible }) => isVisible),
                filter(({ section }) => section !== 'planned'),
                withLatestFrom(this.currentUser$),
                tap(([ event, currentUser ]) => {
                    if (currentUser?.id) {
                        this.getUserAnimeRatesByStatus(currentUser.id, event.section);
                    }
                }),
            )
            .subscribe();

        this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge,
        ])
            .pipe(
                untilDestroyed(this),
                map(({ breakpoints }) => Object.entries(breakpoints)
                    .filter(([_, matched]) => matched)
                    .map(([breakpoint, _]) => breakpoint)
                    ?.[0]
                ),
                tap((breakpoint) => {
                    const baseHeight = 20;
                    const baseWidth = 14;
                    let multiplier: number;

                    switch (breakpoint) {
                        case Breakpoints.XSmall:
                            multiplier = .75;
                            break;
                        case Breakpoints.Small:
                            multiplier = .8;
                            break;
                        case Breakpoints.Medium:
                            multiplier = .65;
                            break;
                        case Breakpoints.Large:
                            multiplier = .7;
                            break;
                        case Breakpoints.XLarge:
                        default:
                            multiplier = .9;
                            break;
                    }

                    this.cardHeight = `${baseHeight * multiplier}rem`;
                    this.cardWidth = `${baseWidth * multiplier}rem`;
                })
            )
            .subscribe();
    }

    initializeValues(): void {
        this.hiddenGridMap = new Map<UserRateStatusType, boolean>();
        this.sectionVisibilitySubject$ = new Subject<VisibilityChangeInterface>();

        this.currentUser$ = this.store$.select(shikimoriCurrentUserSelector);

        this.planned$ = this.store$.select(ratesByStatusSelector('planned'));
        this.watching$ = this.store$.select(ratesByStatusSelector('watching'));
        this.rewatching$ = this.store$.select(ratesByStatusSelector('rewatching'));
        this.completed$ = this.store$.select(ratesByStatusSelector('completed'));
        this.onHold$ = this.store$.select(ratesByStatusSelector('on_hold'));
        this.dropped$ = this.store$.select(ratesByStatusSelector('dropped'));

        this.isPlannedLoaded$ = this.store$.select(isRatesLoadedByStatusSelector('planned'));
        this.isWatchingLoaded$ = this.store$.select(isRatesLoadedByStatusSelector('watching'));
        this.isRewatchingLoaded$ = this.store$.select(isRatesLoadedByStatusSelector('rewatching'));
        this.isCompletedLoaded$ = this.store$.select(isRatesLoadedByStatusSelector('completed'));
        this.isOnHoldLoaded$ = this.store$.select(isRatesLoadedByStatusSelector('on_hold'));
        this.isDroppedLoaded$ = this.store$.select(isRatesLoadedByStatusSelector('dropped'));

        this.animeGrids = [
            {
                status: 'planned',
                rates$: this.planned$,
                isLoaded$: this.isPlannedLoaded$,
            },
            {
                status: 'watching',
                rates$: this.watching$,
                isLoaded$: this.isWatchingLoaded$,
            },
            {
                status: 'rewatching',
                rates$: this.rewatching$,
                isLoaded$: this.isRewatchingLoaded$,
            },
            {
                status: 'completed',
                rates$: this.completed$,
                isLoaded$: this.isCompletedLoaded$,
            },
            {
                status: 'on_hold',
                rates$: this.onHold$,
                isLoaded$: this.isOnHoldLoaded$,
            },
            {
                status: 'dropped',
                rates$: this.dropped$,
                isLoaded$: this.isDroppedLoaded$,
            },
        ];
    }

    toggleHiddenGridStatus(rateStatus: UserRateStatusType): void {
        const status = this.hiddenGridMap.get(rateStatus) || false;

        this.hiddenGridMap.set(rateStatus, !status);
    }

    getHiddenGridStatus(rateStatus: UserRateStatusType): boolean {
        return this.hiddenGridMap.get(rateStatus) || false;
    }

    onSectionVisibilityChange(section: UserRateStatusType, isVisible: boolean): void {
        this.sectionVisibilitySubject$.next({ section, isVisible });
    }

    getUserAnimeRatesByStatus(userId: ResourceIdType, status: UserRateStatusType) {
        this.store$.dispatch(loadAnimeRateByStatusAction({ userId, status }));
    }
}
