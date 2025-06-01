import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonButton,
    IonContent,
    IonIcon,
    IonText,
} from '@ionic/angular/standalone';
import { LayoutModule } from '@angular/cdk/layout';
import { NgxVisibilityModule } from 'ngx-visibility';
import {
    Observable,
    Subject,
    combineLatest,
} from 'rxjs';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    map,
    shareReplay,
    skipWhile,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';

import { AnimeGridInterface } from '@app/modules/home/types/anime-grid.interface';
import { CardGridComponent } from '@app/modules/home/components/card-grid/card-grid.component';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { SortRatesByDateVisitedPipe } from '@app/modules/home/pipes/sort-rates-by-date-visited.pipe';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserBriefInfoInterface } from '@app/shared/types/shikimori/user-brief-info.interface';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import { VisibilityChangeInterface } from '@app/modules/home/types/visibility-change.interface';
import {
    loadAnimeRateByStatusAction,
    selectIsRatesLoadedByStatus,
    selectRatesByStatus,
} from '@app/modules/home/store/anime-rates';
import { recentAnimesToRates } from '@app/modules/home/store/recent-animes/utils/recent-animes-to-rates.function';
import { selectCachedAnimes } from '@app/store/cache/selectors/cache.selectors';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';


@UntilDestroy()
@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        TranslocoModule,
        LayoutModule,
        NgxVisibilityModule,
        CardGridComponent,
        SortRatesByDateVisitedPipe,
        IonIcon,
        IonButton,
        IonText,
        IonContent,
    ],
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    currentUser$: Observable<UserBriefInfoInterface>;

    recent$: Observable<UserAnimeRate[]>;

    planned$: Observable<UserAnimeRate[]>;
    watching$: Observable<UserAnimeRate[]>;
    rewatching$: Observable<UserAnimeRate[]>;
    completed$: Observable<UserAnimeRate[]>;
    onHold$: Observable<UserAnimeRate[]>;
    dropped$: Observable<UserAnimeRate[]>;

    isRecentLoaded$: Observable<boolean>;
    isPlannedLoaded$: Observable<boolean>;
    isWatchingLoaded$: Observable<boolean>;
    isRewatchingLoaded$: Observable<boolean>;
    isCompletedLoaded$: Observable<boolean>;
    isOnHoldLoaded$: Observable<boolean>;
    isDroppedLoaded$: Observable<boolean>;

    animeGrids: AnimeGridInterface[];

    hiddenGridMap: Map<UserRateStatusType, boolean>;

    sectionVisibilitySubject$: Subject<VisibilityChangeInterface>;

    constructor(
        private readonly _store: Store,
        private readonly _title: Title,
        private readonly _transloco: TranslocoService,
    ) {}

    ngOnInit() {
        this.initValues();
        this.initSubscriptions();
    }

    initSubscriptions(): void {
        this.currentUser$
            .pipe(
                untilDestroyed(this),
                skipWhile((currentUser) => !currentUser?.id),
                take(1),
                tap(({ id, nickname }) => {
                    const title = this._transloco.translate('HOME_MODULE.HOME_PAGE.PAGE_TITLE', { nickname });

                    this.getUserAnimeRatesByStatus(id, 'planned');
                    this._title.setTitle(title);
                }),
            )
            .subscribe();

        this.sectionVisibilitySubject$
            .pipe(
                untilDestroyed(this),
                withLatestFrom(this.currentUser$),
                tap(([event, currentUser]) => {
                    if (currentUser?.id && event.isVisible) {
                        this.getUserAnimeRatesByStatus(currentUser.id, event.section);
                    }
                }),
            )
            .subscribe();
    }

    initValues(): void {
        this.hiddenGridMap = new Map<UserRateStatusType, boolean>();
        this.sectionVisibilitySubject$ = new Subject<VisibilityChangeInterface>();

        this.currentUser$ = this._store.select(selectShikimoriCurrentUser);

        this.recent$ = combineLatest([
            this._store.select(selectRecentAnimes),
            this._store.select(selectCachedAnimes),
        ]).pipe(
            map(([recentAnimes, cachedAnimes]) => recentAnimesToRates(recentAnimes, cachedAnimes)),
            shareReplay(1),
        );

        this.planned$ = this._store.select(selectRatesByStatus('planned'));
        this.watching$ = this._store.select(selectRatesByStatus('watching'));
        this.rewatching$ = this._store.select(selectRatesByStatus('rewatching'));
        this.completed$ = this._store.select(selectRatesByStatus('completed'));
        this.onHold$ = this._store.select(selectRatesByStatus('on_hold'));
        this.dropped$ = this._store.select(selectRatesByStatus('dropped'));

        this.isPlannedLoaded$ = this._store.select(selectIsRatesLoadedByStatus('planned'));
        this.isWatchingLoaded$ = this._store.select(selectIsRatesLoadedByStatus('watching'));
        this.isRewatchingLoaded$ = this._store.select(selectIsRatesLoadedByStatus('rewatching'));
        this.isCompletedLoaded$ = this._store.select(selectIsRatesLoadedByStatus('completed'));
        this.isOnHoldLoaded$ = this._store.select(selectIsRatesLoadedByStatus('on_hold'));
        this.isDroppedLoaded$ = this._store.select(selectIsRatesLoadedByStatus('dropped'));

        this.animeGrids = [
            {
                status: 'planned',
                rates: this.planned$,
                isLoaded: this.isPlannedLoaded$,
            },
            {
                status: 'watching',
                rates: this.watching$,
                isLoaded: this.isWatchingLoaded$,
            },
            {
                status: 'rewatching',
                rates: this.rewatching$,
                isLoaded: this.isRewatchingLoaded$,
            },
            {
                status: 'completed',
                rates: this.completed$,
                isLoaded: this.isCompletedLoaded$,
            },
            {
                status: 'on_hold',
                rates: this.onHold$,
                isLoaded: this.isOnHoldLoaded$,
            },
            {
                status: 'dropped',
                rates: this.dropped$,
                isLoaded: this.isDroppedLoaded$,
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

    getUserAnimeRatesByStatus(userId: ResourceIdType, status: UserRateStatusType): void {
        if (status !== 'recent' as UserRateStatusType) {
            this._store.dispatch(loadAnimeRateByStatusAction({ userId, status }));
        }
    }

    isSectionHidden(isLoaded: boolean, rates: UserAnimeRate[]): boolean {
        return isLoaded && !rates?.length;
    }
}
