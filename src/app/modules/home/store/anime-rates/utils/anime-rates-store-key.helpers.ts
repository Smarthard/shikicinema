import {
    LoadStatusKeysType,
    StatusKeysType,
    StatusPageType,
} from '@app/modules/home/store/anime-rates';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export function getRateLoadedKey(status: UserRateStatusType): LoadStatusKeysType {
    switch (status) {
        case 'planned':
            return 'isPlannedLoaded';
        case 'watching':
            return 'isWatchingLoaded';
        case 'rewatching':
            return 'isRewatchingLoaded';
        case 'completed':
            return 'isCompletedLoaded';
        case 'on_hold':
            return 'isOnHoldLoaded';
        case 'dropped':
            return 'isDroppedLoaded';
    }
}

export function getRateStoreKey(status: UserRateStatusType): StatusKeysType {
    return status === 'on_hold' ? 'onHold' : status;
}

export function getRatePageKey(status: UserRateStatusType): StatusPageType {
    const originKey = getRateStoreKey(status);

    return `${originKey}Page`;
}
