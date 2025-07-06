import {
    AsyncPipe,
    UpperCasePipe,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    ViewEncapsulation,
    computed,
    effect,
    inject,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { combineLatest, of } from 'rxjs';
import {
    filter,
    map,
    shareReplay,
} from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { AnimeGridInterface } from '@app/modules/home/types/anime-grid.interface';
import { AnimeRateSectionComponent } from '@app/modules/home/components/anime-rate-section';
import { DEFAULT_ANIME_STATUS_ORDER } from '@app/shared/config/default-anime-status-order.config';
import { ResourceIdType } from '@app/shared/types/resource-id.type';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
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
        AsyncPipe,
        UpperCasePipe,
        IonContent,
        AnimeRateSectionComponent,
    ],
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    host: {
        class: 'home-page',
    },
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

    readonly isTranslationsLoaded = toSignal(
        this.transloco.events$.pipe(filter((e) => e.type === 'translationLoadSuccess')),
    );

    readonly currentUser = this.store.selectSignal(selectShikimoriCurrentUser);

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

    ngOnInit() {
        this.initValues();
    }

    currentUserChangeEffect = effect(() => {
        const currentUser = this.currentUser();
        const hasTranslation = this.isTranslationsLoaded();

        if (currentUser?.id && hasTranslation) {
            const { id, nickname } = currentUser;
            const title = this.transloco.translate('HOME_MODULE.HOME_PAGE.PAGE_TITLE', { nickname });

            this.getUserAnimeRatesByStatus(id, 'planned');
            this.title.setTitle(title);
        }
    });

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

    toggleHiddenGridStatus(rateStatus: string): void {
        const status = this.hiddenGridMap.get(rateStatus as UserRateStatusType) || false;

        this.hiddenGridMap.set(rateStatus as UserRateStatusType, !status);
    }

    getHiddenGridStatus(rateStatus: string): boolean {
        return this.hiddenGridMap.get(rateStatus as UserRateStatusType) || false;
    }

    onSectionVisibilityChange(section: string): void {
        const currentUser = this.currentUser();

        if (currentUser?.id && section !== 'recent') {
            this.getUserAnimeRatesByStatus(currentUser.id, section as UserRateStatusType);
        }
    }

    getUserAnimeRatesByStatus(userId: ResourceIdType, status: UserRateStatusType): void {
        if (status !== 'recent' as UserRateStatusType) {
            this.store.dispatch(loadAnimeRateByStatusAction({ userId, status }));
        }
    }
}
