import { Observable } from 'rxjs';

import { UserAnimeRate } from '@app/shared/types/shikimori/user-anime-rate';

export interface AnimeGridInterface {
    rates: Observable<UserAnimeRate[]>;
    isLoaded: Observable<boolean>;
    label?: string;
}
