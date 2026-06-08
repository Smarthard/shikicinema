import { AsyncPipe, UpperCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    effect,
    inject,
} from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { rxEffect } from 'ngxtension/rx-effect';
import { switchMap } from 'rxjs/operators';

import { AnimeFilterPanelComponent } from '@app/modules/home/components/anime-filters-panel';
import { AnimeQueryFiltersInterface } from '@app/shared/types/shikicinema/v1';
import { AnimeRateSectionComponent } from '@app/modules/home/components/anime-rate-section';
import { ExtendedUserRateStatusType } from '@app/modules/home/types';
import { FooterDirective } from '@app/shared/directives/footer.directive';
import {
    changeAnimeRatesFiltersAction,
    getSortedRatesAction,
    loadAllUserAnimeRatesAction,
    selectIsFiltersOpen,
    selectIsRawRatesLoading,
    selectIsUserRateSectionLoading,
    selectRatesFilters,
    selectRawRates,
    selectUserRateSectionSize,
    selectUserRatesByStatus,
} from '@app/modules/home/store/anime-rates';
import { selectAnimeStatusOrder } from '@app/store/settings/selectors/settings.selectors';
import { selectRecentAnimes } from '@app/modules/home/store/recent-animes';
import {
    selectShikimoriCurrentUserId,
    selectShikimoriCurrentUserNickname,
} from '@app/store/shikimori/selectors/shikimori.selectors';


@Component({
    selector: 'app-home',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [
        AsyncPipe,
        UpperCasePipe,
        IonContent,
        FooterDirective,
        AnimeRateSectionComponent,
        AnimeFilterPanelComponent,
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

    readonly animeStatusOrder = this.store.selectSignal(selectAnimeStatusOrder);
    readonly currentUserId = this.store.selectSignal(selectShikimoriCurrentUserId);
    readonly recent = this.store.selectSignal(selectRecentAnimes);

    readonly rawRates = this.store.selectSignal(selectRawRates);
    readonly isRawRatesLoading = this.store.selectSignal(selectIsRawRatesLoading);

    readonly isFiltersOpen = this.store.selectSignal(selectIsFiltersOpen);
    readonly filters = this.store.selectSignal(selectRatesFilters);

    readonly isSectionLoading = (section: ExtendedUserRateStatusType) =>
        this.store.selectSignal(selectIsUserRateSectionLoading(section));

    readonly userRatesBySection = (section: ExtendedUserRateStatusType) =>
        this.store.select(selectUserRatesByStatus(section));

    readonly sectionSize = (section: ExtendedUserRateStatusType) =>
        this.store.selectSignal(selectUserRateSectionSize(section));

    readonly pageTitle$ = this.store.select(selectShikimoriCurrentUserNickname).pipe(
        switchMap((nickname) => this.transloco.selectTranslate('HOME_MODULE.HOME_PAGE.PAGE_TITLE', { nickname })),
    );

    readonly hiddenGridMap = new Map<ExtendedUserRateStatusType, boolean>();

    readonly filtersChangeEffect = effect(() => {
        if (!this.isRawRatesLoading() && this.currentUserId()) {
            const rates = this.rawRates();
            const filters = this.filters();

            this.store.dispatch(getSortedRatesAction({ rates, filters }));
        }
    });

    onFiltersChange(filters: AnimeQueryFiltersInterface): void {
        this.store.dispatch(changeAnimeRatesFiltersAction({ filters }));
    }

    loadAnimeRatesEffect = effect(() => {
        const userId = this.currentUserId();

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
