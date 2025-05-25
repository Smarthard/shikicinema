import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

interface RatesData {
    planned: UserAnimeRate[];
    watching: UserAnimeRate[];
    rewatching: UserAnimeRate[];
    completed: UserAnimeRate[];
    onHold: UserAnimeRate[];
    dropped: UserAnimeRate[];
}

interface RatesPages {
    plannedPage: number;
    watchingPage: number;
    rewatchingPage: number;
    completedPage: number;
    onHoldPage: number;
    droppedPage: number;
}

interface RatesLoadStatus {
    isPlannedLoaded: boolean;
    isWatchingLoaded: boolean;
    isRewatchingLoaded: boolean;
    isCompletedLoaded: boolean;
    isOnHoldLoaded: boolean;
    isDroppedLoaded: boolean;
}

export type StatusKeysType = keyof RatesData;
export type StatusPageType = keyof RatesPages;
export type LoadStatusKeysType = keyof RatesLoadStatus;

export interface AnimeRatesStoreInterface extends RatesData, RatesPages, RatesLoadStatus {}
