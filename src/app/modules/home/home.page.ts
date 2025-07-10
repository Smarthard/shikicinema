import { AsyncPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    effect,
    inject,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { rxEffect } from 'ngxtension/rx-effect';
import { toSignal } from '@angular/core/rxjs-interop';

import { AnimeRateSectionComponent } from '@app/modules/home/components/anime-rate-section';
import { DEFAULT_ANIME_STATUS_ORDER } from '@app/shared/config/default-anime-status-order.config';
import { ExtendedUserRateStatusType } from '@app/modules/home/types';
import { FilterRatesByStatusPipe } from '@app/modules/home/pipes/filter-rates-by-status.pipe';
import {
    SortRatesByDateVisitedPipe,
    SortRatesByUserScorePipe,
} from '@app/modules/home/pipes';
import {
    loadAllUserAnimeRatesAction,
    selectIsMetadataLoading,
    selectRates,
} from '@app/modules/home/store/anime-rates';
import { recentAnimesToRates } from '@app/modules/home/store/recent-animes/utils/recent-animes-to-rates.function';
import { selectCachedAnimes } from '@app/store/cache/selectors/cache.selectors';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';
import { selectSettings } from '@app/store/settings/selectors/settings.selectors';
import {
    selectShikimoriCurrentUser,
    selectShikimoriCurrentUserNickname,
} from '@app/store/shikimori/selectors/shikimori.selectors';


@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        AsyncPipe,
        UpperCasePipe,
        SlicePipe,
        IonContent,
        AnimeRateSectionComponent,
        FilterRatesByStatusPipe,
        SortRatesByUserScorePipe,
        SortRatesByDateVisitedPipe,
    ],
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    host: {
        class: 'home-page',
    },
})
export class HomePage {
    private readonly store = inject(Store);
    private readonly title = inject(Title);
    private readonly transloco = inject(TranslocoService);

    readonly settings = this.store.selectSignal(selectSettings);
    readonly currentUser = this.store.selectSignal(selectShikimoriCurrentUser);

    readonly userAnimeRates = this.store.selectSignal(selectRates);
    readonly isMetadataLoading = this.store.selectSignal(selectIsMetadataLoading);

    readonly useCustomAnimeStatusOrder = computed(() => this.settings()?.useCustomAnimeStatusOrder);
    readonly animeStatusOrder = computed(() => this.useCustomAnimeStatusOrder()
        ? this.settings()?.userAnimeStatusOrder as ExtendedUserRateStatusType[]
        : DEFAULT_ANIME_STATUS_ORDER,
    );

    readonly pageTitle$ = this.store.select(selectShikimoriCurrentUserNickname).pipe(
        switchMap((nickname) => this.transloco.selectTranslate('HOME_MODULE.HOME_PAGE.PAGE_TITLE', { nickname })),
    );

    readonly recent = toSignal(combineLatest([
        this.store.select(selectRecentAnimes),
        this.store.select(selectCachedAnimes),
    ]).pipe(map(([recentAnimes, cachedAnimes]) => recentAnimesToRates(recentAnimes, cachedAnimes))));

    readonly userAnimeRatesWithRecent = computed(
        () => [...this.userAnimeRates(), ...this.recent()],
    );

    readonly hiddenGridMap = new Map<ExtendedUserRateStatusType, boolean>();

    loadAnimeRatesEffect = effect(() => {
        const userId = this.currentUser()?.id;

        if (userId) {
            this.store.dispatch(loadAllUserAnimeRatesAction({ userId }));
        }
    });

    setPageTitleEffect = rxEffect(this.pageTitle$, (title) => this.title.setTitle(title));

    toggleHiddenGridStatus(rateStatus: ExtendedUserRateStatusType): void {
        const status = this.hiddenGridMap.get(rateStatus) || false;

        this.hiddenGridMap.set(rateStatus, !status);
    }

    getHiddenGridStatus(rateStatus: ExtendedUserRateStatusType): boolean {
        return this.hiddenGridMap.get(rateStatus) || false;
    }
}
