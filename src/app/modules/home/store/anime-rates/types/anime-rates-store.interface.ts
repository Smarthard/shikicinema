import { AnimeRatesMetadata } from '@app/modules/home/store/anime-rates/types/anime-rate-metadata.interface';
import { ResourceIdType } from '@app/shared/types';
import { UserBriefRateInterface } from '@app/shared/types/shikimori';

export interface AnimeRatesStoreInterface {
    rates: { [animeId: ResourceIdType]: UserBriefRateInterface };
    isRatesLoading: boolean;
    metadata: AnimeRatesMetadata;
    metaSize: number;
}
