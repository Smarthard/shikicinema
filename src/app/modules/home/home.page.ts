import {
    AsyncPipe,
    NgTemplateOutlet,
    UpperCasePipe,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    ViewEncapsulation,
    computed,
    inject,
} from '@angular/core';
import {
    IonButton,
    IonContent,
    IonIcon,
    IonText,
} from '@ionic/angular/standalone';
import { NgxVisibilityDirective } from 'ngx-visibility';
import { Store } from '@ngrx/store';
import {
    Subject,
    combineLatest,
    of,
} from 'rxjs';
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
import { DEFAULT_ANIME_STATUS_ORDER } from '@app/shared/config/default-anime-status-order.config';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
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
import { selectSettings } from '@app/store/settings/selectors/settings.selectors';
import { selectShikimoriCurrentUser } from '@app/store/shikimori/selectors/shikimori.selectors';
import { sortRatesByDateVisited } from '@app/modules/home/utils';


@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        NgxVisibilityDirective,
        AsyncPipe,
        UpperCasePipe,
        NgTemplateOutlet,
        TranslocoPipe,
        CardGridComponent,
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

    readonly settings = this.store.selectSignal(selectSettings);

    readonly useCustomAnimeStatusOrder = computed(() => this.settings()?.useCustomAnimeStatusOrder);
    readonly animeStatusOrder = computed(() => this.useCustomAnimeStatusOrder()
        ? this.settings()?.userAnimeStatusOrder
        : DEFAULT_ANIME_STATUS_ORDER,
    );

    readonly isTranslationsLoaded$ = this.transloco.events$.pipe(
        filter((e) => e.type === 'translationLoadSuccess'),
    );

    readonly currentUser$ = this.store.select(selectShikimoriCurrentUser);

    readonly recent$ = combineLatest([
        this.store.select(selectRecentAnimes),
        this.store.select(selectCachedAnimes),
    ]).pipe(
        map(([recentAnimes, cachedAnimes]) => recentAnimesToRates(recentAnimes, cachedAnimes)),
        map((recentRates) => sortRatesByDateVisited(recentRates?.slice(0, 6))),
        shareReplay(1),
    );

    readonly planned$ = this.store.select(selectRatesByStatus('planned'));
    readonly watching$ = this.store.select(selectRatesByStatus('watching'));
    readonly rewatching$ = this.store.select(selectRatesByStatus('rewatching'));
    readonly completed$ = this.store.select(selectRatesByStatus('completed'));
    readonly onHold$ = this.store.select(selectRatesByStatus('on_hold'));
    readonly dropped$ = this.store.select(selectRatesByStatus('dropped'));

    readonly isPlannedLoaded$ = this.store.select(selectIsRatesLoadedByStatus('planned'));
    readonly isWatchingLoaded$ = this.store.select(selectIsRatesLoadedByStatus('watching'));
    readonly isRewatchingLoaded$ = this.store.select(selectIsRatesLoadedByStatus('rewatching'));
    readonly isCompletedLoaded$ = this.store.select(selectIsRatesLoadedByStatus('completed'));
    readonly isOnHoldLoaded$ = this.store.select(selectIsRatesLoadedByStatus('on_hold'));
    readonly isDroppedLoaded$ = this.store.select(selectIsRatesLoadedByStatus('dropped'));

    animeGridMap: Map<string, AnimeGridInterface>;

    hiddenGridMap: Map<UserRateStatusType, boolean>;

    sectionVisibilitySubject$ = new Subject<VisibilityChangeInterface>();

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
        this.animeGridMap = new Map([
            [
                'recent',
                {
                    rates: this.recent$.pipe(),
                    isLoaded: of(true),
                },
            ],
            [
                'planned',
                {
                    rates: this.planned$,
                    isLoaded: this.isPlannedLoaded$,
                },
            ],
            [
                'watching',
                {
                    rates: this.watching$,
                    isLoaded: this.isWatchingLoaded$,
                },
            ],
            [
                'rewatching',
                {
                    rates: this.rewatching$,
                    isLoaded: this.isRewatchingLoaded$,
                },
            ],
            [
                'completed',
                {
                    rates: this.completed$,
                    isLoaded: this.isCompletedLoaded$,
                },
            ],
            [
                'on_hold',
                {
                    rates: this.onHold$,
                    isLoaded: this.isOnHoldLoaded$,
                },
            ],
            [
                'dropped',
                {
                    rates: this.dropped$,
                    isLoaded: this.isDroppedLoaded$,
                },
            ],
        ]);
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
