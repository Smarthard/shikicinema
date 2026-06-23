import { AnimeQueryFiltersInterface, ShikicinemaGenre, ShikicinemaStudio } from '@app/shared/types/shikicinema/v1';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export interface AnimeRatesStoreInterface {
    rawRates: UserAnimeRate[];
    isRawRatesLoading: boolean;
    isFirstLoading: boolean;

    isRatesLoading: boolean;
    rates: UserAnimeRate[];

    isFiltersOpen: boolean;
    filters: AnimeQueryFiltersInterface;

    isGenresLoading: boolean;
    genres: ShikicinemaGenre[];

    isStudiosLoading: boolean;
    studios: ShikicinemaStudio[];
}
