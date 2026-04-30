import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    computed,
    inject,
    input,
    output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular/standalone';
import { TranslocoService } from '@jsverse/transloco';
import { explicitEffect } from 'ngxtension/explicit-effect';

import { FilterByKindPipe } from '@app/shared/pipes/filter-by-kind/filter-by-kind.pipe';
import { GetActiveKindsPipe } from '@app/shared/pipes/get-active-kinds/get-active-kinds.pipe';
import { KindSelectorComponent } from '@app/modules/player/components/kind-selector/kind-selector.component';
import { NoPreferenceSymbol } from '@app/store/settings/types';
import { ResourceIdType } from '@app/shared/types';
import { VideoInfoInterface, VideoKindEnum } from '@app/modules/player/types';
import { VideoSelectorComponent } from '@app/modules/player/components/video-selector/video-selector.component';
import { authorAvailability, filterVideosByDomains } from '@app/modules/player/utils';
import { filterByEpisode } from '@app/shared/utils/filter-by-episode.function';
import { filterVideosByPreferences } from '@app/modules/player/utils/filter-videos-by-preferences.function';
import {
    selectAuthorPreferencesByAnime,
    selectDomainFilters,
    selectDomainPreferencesByAnime,
    selectKindPreferencesByAnime,
    selectPlayerKindDisplayMode,
    selectPreferencesToggle,
} from '@app/store/settings/selectors/settings.selectors';

@Component({
    selector: 'app-player-selector',
    imports: [
        KindSelectorComponent,
        VideoSelectorComponent,
        FilterByKindPipe,
        GetActiveKindsPipe,
    ],
    templateUrl: './player-selector.component.html',
    styleUrl: './player-selector.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'player-selector',
    },
})
export class PlayerSelectorComponent {
    private readonly store = inject(Store);
    private readonly toast = inject(ToastController);
    private readonly transloco = inject(TranslocoService);

    readonly playerKindDisplayMode = this.store.selectSignal(selectPlayerKindDisplayMode);
    readonly domainFilters = this.store.selectSignal(selectDomainFilters);

    readonly animeId = input.required<ResourceIdType>();
    readonly kind = input.required<VideoKindEnum>();
    readonly episode = input.required<number>();
    readonly lastAiredEpisode = input.required<number>();
    readonly maxEpisode = input.required<number>();
    readonly isFilterDomains = input.required<boolean>();
    readonly isLoading = input.required<boolean>();

    readonly videos = input<VideoInfoInterface[]>([]);
    readonly selectedVideo = input<VideoInfoInterface>();

    readonly changeVideo = output<[VideoInfoInterface, boolean]>();
    readonly changeKind = output<VideoKindEnum>();
    readonly domainFiltersOff = output();

    readonly isPreferencesToggleOn = this.store.selectSignal(selectPreferencesToggle);
    readonly authorPreferences = computed(
        () => this.store.selectSignal(selectAuthorPreferencesByAnime(this.animeId()))(),
    );
    readonly kindPreferences = computed(
        () => this.store.selectSignal(selectKindPreferencesByAnime(this.animeId()))(),
    );
    readonly domainPreferences = computed(
        () => this.store.selectSignal(selectDomainPreferencesByAnime(this.animeId()))(),
    );

    readonly episodeVideosUnfiltered = computed(() => filterByEpisode(this.videos(), this.episode()));
    readonly episodeVideosFiltered = computed(
        () => filterVideosByDomains(this.episodeVideosUnfiltered(), this.domainFilters()),
    );
    readonly episodeVideos = computed(() => this.isFilterDomains()
        ? this.episodeVideosFiltered()
        : this.episodeVideosUnfiltered(),
    );
    readonly availability = computed(() => authorAvailability(this.videos(), this.maxEpisode()));
    readonly hasUnfilteredVideos = computed(() => this.episodeVideosUnfiltered()?.length > 0 && this.isFilterDomains());

    readonly episodeVideosChangeEffect = explicitEffect(
        [this.episodeVideos, this.isLoading],
        ([videos, isLoading]) => {
            if (!isLoading && videos?.length > 0) {
                const author = this.authorPreferences();
                const domain = this.domainPreferences();
                const kind = this.kindPreferences();
                const isPreferencesToggleOn = this.isPreferencesToggleOn();

                const relevantVideos = isPreferencesToggleOn
                    ? filterVideosByPreferences(videos, author, domain, kind)
                    : videos;

                if (!relevantVideos &&
                    author !== NoPreferenceSymbol &&
                    domain !== NoPreferenceSymbol &&
                    kind !== NoPreferenceSymbol
                ) {
                    this.toast.create({
                        id: 'player-relevant-videos-missing',
                        color: 'warning',
                        message: this.transloco.translate('PLAYER_MODULE.PLAYER_PAGE.RELEVANT_VIDEOS_MISSING'),
                        duration: 1000,
                    }).then((toast) => toast.present());
                }

                const chosenVideo = (relevantVideos || videos)?.[0];

                this.onVideoChange(chosenVideo, false);
            }
        },
    );

    onKindChange(kind: VideoKindEnum): void {
        this.changeKind.emit(kind);
    }

    onVideoChange(video: VideoInfoInterface, isShouldUpdatePref = true): void {
        this.changeVideo.emit([video, isShouldUpdatePref]);
    }

    onDisableDomainFilters(): void {
        this.domainFiltersOff.emit();
    }
}
