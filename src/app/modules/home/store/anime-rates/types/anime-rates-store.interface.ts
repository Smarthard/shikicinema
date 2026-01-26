import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export interface AnimeRatesStoreInterface {
    rates: UserAnimeRate[];
    isRatesLoading: boolean;
}
