import { Observable } from 'rxjs';

import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';
import { UserRateStatusType } from '@app/shared/types/shikimori/user-rate-status.type';

export interface AnimeGridInterface {
    status: UserRateStatusType;
    rates$: Observable<UserAnimeRate[]>;
    isLoaded$: Observable<boolean>;
    label?: string;
}
