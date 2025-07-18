import {
    AsyncPipe,
    NgTemplateOutlet,
    SlicePipe,
    UpperCasePipe,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import {
    IonButton,
    IonContent,
    IonIcon,
    IonText,
} from '@ionic/angular/standalone';
import { NgxVisibilityDirective } from 'ngx-visibility';
import {
    Observable,
    Subject,
    combineLatest,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    filter,
    map,
    shareReplay,
    skipWhile,
    take,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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


@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgxVisibilityDirective,
        AsyncPipe,
        UpperCasePipe,
        SlicePipe,
        NgTemplateOutlet,
        TranslocoPipe,
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
    private readonly store = inject(Store);
    private readonly title = inject(Title);
    private readonly transloco = inject(TranslocoService);
    private readonly destroyRef = inject(DestroyRef);

    readonly isTranslationsLoaded$ = this.transloco.events$.pipe(
        filter((e) => e.type === 'translationLoadSuccess'),
    );

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

    ngOnInit() {
        this.initValues();
        this.initSubscriptions();
    }

    initSubscriptions(): void {
        combineLatest([
            this.currentUser$,
            this.isTranslationsLoaded$,
        ]).pipe(
            skipWhile(([currentUser, hasTranslation]) => !currentUser?.id && !hasTranslation),
            take(1),
            tap(([{ id, nickname }]) => {
                const title = this.transloco.translate('HOME_MODULE.HOME_PAGE.PAGE_TITLE', { nickname });

                this.getUserAnimeRatesByStatus(id, 'planned');
                this.title.setTitle(title);
            }),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe();

        this.sectionVisibilitySubject$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
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

        this.currentUser$ = this.store.select(selectShikimoriCurrentUser);

        this.recent$ = combineLatest([
            this.store.select(selectRecentAnimes),
            this.store.select(selectCachedAnimes),
        ]).pipe(
            map(([recentAnimes, cachedAnimes]) => recentAnimesToRates(recentAnimes, cachedAnimes)),
            shareReplay(1),
        );

        this.planned$ = this.store.select(selectRatesByStatus('planned'));
        this.watching$ = this.store.select(selectRatesByStatus('watching'));
        this.rewatching$ = this.store.select(selectRatesByStatus('rewatching'));
        this.completed$ = this.store.select(selectRatesByStatus('completed'));
        this.onHold$ = this.store.select(selectRatesByStatus('on_hold'));
        this.dropped$ = this.store.select(selectRatesByStatus('dropped'));

        this.isPlannedLoaded$ = this.store.select(selectIsRatesLoadedByStatus('planned'));
        this.isWatchingLoaded$ = this.store.select(selectIsRatesLoadedByStatus('watching'));
        this.isRewatchingLoaded$ = this.store.select(selectIsRatesLoadedByStatus('rewatching'));
        this.isCompletedLoaded$ = this.store.select(selectIsRatesLoadedByStatus('completed'));
        this.isOnHoldLoaded$ = this.store.select(selectIsRatesLoadedByStatus('on_hold'));
        this.isDroppedLoaded$ = this.store.select(selectIsRatesLoadedByStatus('dropped'));

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
            this.store.dispatch(loadAnimeRateByStatusAction({ userId, status }));
        }
    }

    isSectionHidden(isLoaded: boolean, rates: UserAnimeRate[]): boolean {
        return isLoaded && !rates?.length;
    }
}
