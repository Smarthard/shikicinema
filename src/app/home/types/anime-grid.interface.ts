import { Observable } from 'rxjs';

import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';
import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export interface AnimeGridInterface {
    status: UserRateStatusType;
    rates$: Observable<UserAnimeRate[]>;
    isLoaded$: Observable<boolean>;
    label?: string;
}
